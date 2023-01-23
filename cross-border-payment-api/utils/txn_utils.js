const Transaction = require("../models/TransactionHistory");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

// Create send function
const send = async (sender, receiver, txnData, web3) => {
  let addressFrom = sender.walletAdrHash;
  let addressFromPK = sender.walletPKHash;

  let addressTo = receiver.walletAdrHash;

  let createTransaction;
  let createReceipt;

  console.log(
    `Attempting to send transaction from ${addressFrom} to ${addressTo}`
  );

  try {
    // Sign transaction with PK
    createTransaction = await web3.eth.accounts.signTransaction(
      {
        gas: 60000,
        to: process.env.pdcContractAddress,
        data: txnData,
      },
      addressFromPK
    );
    console.log(createTransaction);
  } catch (error) {
    console.error(error);
  }

  try {
    // Send transaction and wait for receipt
    createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
    );
  } catch (error) {
    console.error(error);
  }

  return createReceipt.transactionHash;
};

const createTxnHistory = async (
  sender,
  receiver,
  amountToTransfer,
  txnHash
) => {
  // create transaction history
  const transactionData = {
    accountFrom: sender,
    accountTo: receiver,
    transactionAmount: amountToTransfer,
    timestamp: new Date().toISOString(),
    meta: {
      currency: sender.currency,
      transactionHash: txnHash,
    },
  };

  try {
    await Transaction.create(transactionData);
    console.log("Transaction history created");
  } catch (error) {
    // Handle error
    throw error;
  }
};

const makeTransaction = async (
  sender,
  receiver,
  amountToTransfer,
  web3,
  lms
) => {
  let receiverAddr = receiver.walletAdrHash;

  // create transfer data
  const amount = web3.utils.toBN(amountToTransfer);
  const data = lms.methods.transfer(receiverAddr, amount).encodeABI();

  // perform transaction
  const hash = await send(sender, receiver, data, web3);

  return hash;
};

module.exports = {
  send,
  createTxnHistory,
  makeTransaction,
};
