const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const Account = require("../models/Account");
const Transaction = require("../models/TransactionHistory");

const BASE_URL = "/api/payments/crossborder";
const contractAddress = "0x1A9D660da99c095BF391690f4fE46B1Ff2CC197F";
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

// create new transaction
async function insertTransaction(transactionData) {
  let transactionId = Math.floor(Math.random() * 1000000);
  const existingTransaction = await Transaction.findOne({ transactionId });
  while (existingTransaction) {
    transactionId = Math.floor(Math.random() * 1000000);
    existingTransaction = await Transaction.findOne({ transactionId });
  }
  transactionData.transactionId = transactionId;
  return Transaction.create(transactionData);
}

module.exports = function (app, ABI, web3, accounts) {
  app.get("/", (req, res) => {
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

    // create contract
    let contract = new web3.eth.Contract(ABI, contractAddress);

    // create transfer data
    const amount = web3.utils.toBN(amountToTransfer);
    const data = contract.methods.transfer(accountTo, amount).encodeABI();

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
      transactionId: 0,
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
      await insertTransaction(transactionData);
    } catch (error) {
      // Handle error
      throw error;
    }

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

    // create contract
    let contract = new web3.eth.Contract(ABI, contractAddress);

    // create transfer data
    const amount = web3.utils.toBN(amountToTransfer);
    const data = contract.methods.transfer(accountTo, amount).encodeABI();

    // Create send function
    const send = async (accountFromWalletAddr, accountFromPK, addressTo) => {
        // check balance
      var accountBalance = await contract.methods.balanceOf(accountFrom).call();
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

    // Expected response: transaction history object
    res.send("Transaction hash: " + hash);
  });

  app.get(BASE_URL + "/:paymentId", (req, res) => {
    let paymentId = req.params.paymentId;
    res.send("Payment id: " + paymentId);
  });

  app.get(BASE_URL + "/:paymentId/confirm", (req, res) => {
    let paymentId = req.params.paymentId;
    res.send("Payment id to confirm: " + paymentId);
  });
};
