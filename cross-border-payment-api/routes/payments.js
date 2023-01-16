const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const Account = require("../models/Account");
const Transaction = require("../models/TransactionHistory");

const BASE_URL = "/api/payments/crossborder";
const contractAddress = process.env.pdcContractAddress;
const PANDA_ACC = "9250";

// get account details
async function retrieveDocumentByAccountNumber(accountNumber) {
  try {
    const doc = await Account.findOne({ accountNumber: accountNumber }).exec();
    return doc;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// deduct account balance
async function deductBalance(accountNumber, value) {
  try {
    const account = await Account.findOne({ accountNumber });
    if (!account) throw new Error("Account not found.");
    account.balance -= value;
    await account.save();
    return account;
  } catch (error) {
    throw error;
  }
}

// increase account balance
async function increaseBalance(accountNumber, value) {
  try {
    const account = await Account.findOne({ accountNumber });
    if (!account) throw new Error("Account not found.");
    account.balance += value;
    await account.save();
    return account;
  } catch (error) {
    throw error;
  }
}

module.exports = function (app, lms, web3) {
  app.get(BASE_URL + "/", (req, res) => {
    res.send("Welcome to cross border payments");
  });

  app.put(BASE_URL + "/confirm", async (req, res) => {
    // Transfer a value between accounts informed

    /**
     * AccountTo, AccountFrom, TransferAmount
     */

    const amountToTransfer = req.body.amountToTransfer;
    let accountFrom;
    let accountFromPK;
    let accountTo;

    /**
     * Future TODO - a separate function
     *
     * currency exchange
     * check accountTo currency and accountFrom currency
     * if different currency, convert to accountTo currency using an external exchange rate API
     */

    /**
     * Future TODO - 1-1 peg currency to pandacoin
     *
     */

    /**
     * To do
     */
    // get PK and wallet address of from wallet
    const sender = await retrieveDocumentByAccountNumber(PANDA_ACC);
    accountFromPK = sender.walletPKHash;
    accountFrom = sender.walletAdrHash;

    const receiver = await retrieveDocumentByAccountNumber(req.body.accountTo);
    accountTo = receiver.walletAdrHash;

    // create transfer data
    const amount = web3.utils.toBN(amountToTransfer);
    const data = lms.methods.transfer(accountTo, amount).encodeABI();

    // Create send function
    const send = async (accountFromWalletAddr, accountFromPK, addressTo) => {
      console.log(
        `Attempting to send transaction from ${accountFromWalletAddr} to ${addressTo}`
      );

      // Sign transaction with PK
      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          gas: 60000,
          to: contractAddress,
          data: data,
        },
        accountFromPK
      );

      // Send transaction and wait for receipt
      const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );
      console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
      );
      return createReceipt.transactionHash;
    };

    // perform transaction
    const hash = await send(accountFrom, accountFromPK, accountTo);

    // create transaction history
    const transactionData = {
      accountFrom: req.body.accountFrom,
      accountTo: req.body.accountTo,
      transactionAmount: req.body.amountToTransfer,
      timestamp: new Date().toISOString(),
      meta: {
        currency: "n/a",
        transactionHash: hash,
      },
    };

    try {
      await Transaction.create(transactionData);
    } catch (error) {
      // Handle error
      throw error;
    }

    // decrease balance of account
    deductBalance(req.body.accountFrom, amountToTransfer);

    // Expected response: transaction history object
    res.send("Transaction hash: " + hash);
  });

  app.put(BASE_URL + "/retrieve", async (req, res) => {
    // Transfer a value between accounts informed

    /**
     * AccountTo, TransferAmount
     */

    const amountToTransfer = req.body.amountToTransfer;
    let accountFromPK;
    let accountFrom;
    let accountTo;

    /**
     * Future TODO - a separate function
     *
     * currency exchange
     * check accountTo currency and accountFrom currency
     * if different currency, convert to accountTo currency using an external exchange rate API
     */

    /**
     * Future TODO - 1-1 peg currency to pandacoin
     *
     */

    /**
     * To do
     */
    // get PK and wallet address of from wallet
    const sender = await retrieveDocumentByAccountNumber(req.body.accountTo);
    accountFromPK = sender.walletPKHash;
    accountFrom = sender.walletAdrHash;

    const receiver = await retrieveDocumentByAccountNumber(PANDA_ACC);
    accountTo = receiver.walletAdrHash;

    // create transfer data
    const amount = web3.utils.toBN(amountToTransfer);
    const data = lms.methods.transfer(accountTo, amount).encodeABI();

    // Create send function
    const send = async (accountFromWalletAddr, accountFromPK, addressTo) => {
      // check balance
      var accountBalance = await lms.methods.balanceOf(accountFrom).call();
      if (amountToTransfer > Number(accountBalance)) {
        const error = "Balance not sufficient!";
        res.status(400).send({ message: error });
        throw new Error(error);
      }

      console.log(
        `Attempting to send transaction from ${accountFromWalletAddr} to ${addressTo}`
      );

      // Sign transaction with PK
      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          gas: 60000,
          to: contractAddress,
          data: data,
        },
        accountFromPK
      );

      // Send transaction and wait for receipt
      const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );
      console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
      );
      return createReceipt.transactionHash;
    };

    // perform transaction
    const hash = await send(accountFrom, accountFromPK, accountTo);

    // increase balance of account
    increaseBalance(req.body.accountTo, amountToTransfer);

    // Expected response: transaction history object
    res.send("Transaction hash: " + hash);
  });
};
