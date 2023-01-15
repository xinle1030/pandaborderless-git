const mongoose = require("mongoose");

const transactionHistorySchema = new mongoose.Schema({
  transactionId: {
    type: Number,
    required: true,
  },
  // The user associated with the transaction
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
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
