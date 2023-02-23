const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  walletAdrHash: {
    type: String,
  },
  walletPKHash: {
    type: String,
  },
  currency: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

module.exports = mongoose.model("Account", accountSchema);