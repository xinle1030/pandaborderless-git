const mongoose = require("mongoose");

const transactionHistorySchema = new mongoose.Schema({
  // The user associated with the transaction
  accountFrom: {
    type: String,
  },
  accountTo: {
    type: String,
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
    transactionHash: { type: String, required: true },
  },
});

module.exports = mongoose.model("TransactionHistory", transactionHistorySchema);
