const mongoose = require("mongoose");

const transactionHistorySchema = new mongoose.Schema({
  // The user associated with the transaction
  accountFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  accountTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  exchangeRate: {
    type: Number,
  },
  transactionAmount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  meta: {
    currency: { type: String },
    txnHash1: { type: String, required: true },
    txnHash2: { type: String, required: true },
  },
});

module.exports = mongoose.model("TransactionHistory", transactionHistorySchema);
