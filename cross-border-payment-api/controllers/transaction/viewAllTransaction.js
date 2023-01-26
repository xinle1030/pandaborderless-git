const Transaction = require("../../models/TransactionHistory");

module.exports = (req, res) => {
  console.log("Get all transactions");

  Transaction.find({})
    .sort({ _id: -1 })
    .then((data) => {
      console.log("Transaction: ", data);
      res.json(data);
    })
    .catch((error) => {
      console.log("Transaction: ", error);
    });
};
