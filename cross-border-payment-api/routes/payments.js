const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const BASE_URL = "/api/payments/crossborder";

module.exports = function (app, lms, accounts) {
  app.get("/", (req, res) => {
    res.send("Welcome to cross border payments");
  });

  app.get(BASE_URL + "/confirm", (req, res) => {
    res.send("Confirm multiple previously initiated cross-border payments");
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