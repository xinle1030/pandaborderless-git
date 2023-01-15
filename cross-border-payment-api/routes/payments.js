const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const Account = require("../models/Account");

const BASE_URL = "/api/payments/crossborder";

module.exports = function (app, lms, accounts) {
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

    await Account.findOne({
      accountNumber: req.body.accountTo,
    }).exec((err, accountTo) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      accountToWalletAddr = accountTo.walletAdrHash;
    });

    

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
