const Transaction = require("../../models/TransactionHistory");

module.exports = (req, res) => {
  console.log("Get transaction by id");

  Transaction.findOne({
    "meta.transactionHash": req.params.transactionHash,
  }).exec((err, transaction) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (transaction) {
      return res.status(200).send(transaction);
    } else {
      res.status(400).send({ message: "No such transaction exists!" });
    }
  });
};
