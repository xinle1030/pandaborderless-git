const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  account: {
    type: Number,
    required: true,
    unique: true,
  },
  walletAdrHash: {
    type: String,
  },
  walletPKHash: {
    type: String,
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

module.exports =
  mongoose.models.Account || mongoose.model("Account", accountSchema);