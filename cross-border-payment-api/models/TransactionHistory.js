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
    type: Number,
    required: true,
  },
  accountTo: {
    type: Number,
    required: true,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  transactionAmount: {
    type: Number,
    required: true,
  },
  dateTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TransactionHistory", transactionHistorySchema);
