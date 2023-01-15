const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const Account = require("../models/Account");

const BASE_URL = "/api/payments/crossborder";
const contractAddress = "0x1A9D660da99c095BF391690f4fE46B1Ff2CC197F";

module.exports = function (app, lms, web3, accounts) {
  app.get("/", (req, res) => {
    res.send("Welcome to cross border payments");
  });

  app.put(BASE_URL + "/confirm", async (req, res) => {
    // Transfer a value between accounts informed

    /**
     * AccountTo, AccountFrom, TransferAmount
     */

    const amountToTransfer = req.body.amountToTransfer;

    let accountFromPK;
    let accountFromWalletAddr;
    let accountToWalletAddr;

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
    await Account.findOne({
      accountNumber: req.body.accountFrom,
    }).exec((err, accountFrom) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      accountFromPK = accountFrom.walletPKHash;
      accountFromWalletAddr = accountFrom.walletAdrHash;
    });

    // get recipient wallet address
    await Account.findOne({
      accountNumber: req.body.accountTo,
    }).exec((err, accountTo) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      accountToWalletAddr = accountTo.walletAdrHash;
    });

    // create transfer data
    const amount = web3.utils.toBN(amountToTransfer);
    const data = lms.methods.transfer("0x33Ee02c93Ac44856e5F89089a0c472FEE1f49510", amount).encodeABI();

    // Create send function
    const send = async (accountFromWalletAddr, accountFromPK, addressTo) => {
      console.log(
        `Attempting to send transaction from ${accountFromWalletAddr} to ${addressTo}`
      );

      // Sign transaction with PK
      const createTransaction = await web3.eth.accounts.signTransaction(
        {
          gas: 22000,
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
    };

    // perform transaction 
    send("0xE4f4b37F70fEDAA6F2Eea10995a09fC4C16986Da", "bf8a1e542f4e241d03a1b5d907754f1986e6e180a7ab050a593db47b9fb78a12", "0x33Ee02c93Ac44856e5F89089a0c472FEE1f49510");

    // Expected response: transaction history object
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
