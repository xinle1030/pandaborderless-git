const Transaction = require("../models/TransactionHistory");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

/**
 * Sends a transaction from the `sender` account to the `receiver` account.
 *
 * @param {Object} sender - The sender account object.
 * @param {string} sender.walletAdrHash - The sender's wallet address hash.
 * @param {string} sender.walletPKHash - The sender's wallet private key hash.
 * @param {Object} receiver - The receiver account object.
 * @param {string} receiver.walletAdrHash - The receiver's wallet address hash.
 * @param {string} txnData - The transaction data to be sent.
 * @param {Object} web3 - The web3 instance.
 *
 * @return {string} - The transaction hash.
 */
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

  // return the transaction hash
  return createReceipt.transactionHash;
};

/**
 * Creates a transaction history in the database.
 *
 * @param {Object} sender - The sender account object.
 * @param {Object} receiver - The receiver account object.
 * @param {number} amountToTransfer - The amount to be transferred.
 * @param {string} hash1 - The transaction hash 1.
 * @param {string} hash2 - The transaction hash 2.
 * @param {number} exchangeRate - The exchange rate.
 * @param {number} exchangeBackRate - The exchange back rate.
 *
 * @return {Object} - The created transaction history object.
 */
const createTxnHistory = async (
  sender,
  receiver,
  amountToTransfer,
  hash1,
  hash2,
  exchangeRate,
  exchangeBackRate
) => {
  // create transaction history
  const transactionData = {
    accountFrom: sender,
    accountTo: receiver,
    transactionAmount: amountToTransfer,
    timestamp: new Date().toISOString(),
    meta: {
      currency: sender.currency,
      txnHash1: hash1,
      txnHash2: hash2,
      fxRate1: exchangeRate,
      fxRate2: exchangeBackRate,
    },
  };

  try {
    let transactionHistory = await Transaction.create(transactionData);
    console.log("Transaction history created");
    return transactionHistory;
  } catch (error) {
    // Handle error
    throw error;
  }
};

/**
 * Creates and perform the transaction..
 *
 * @param {Object} sender - The sender account object.
 * @param {Object} receiver - The receiver account object.
 * @param {number} amountToTransfer - The amount to be transferred.
 * @param {Object} web3 - The web3 instance.
 * @param {Object} lmb - The instance of the smart contract that holds the details of the token.
 *
 * @return {string} - The transaction hash.
 */
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
