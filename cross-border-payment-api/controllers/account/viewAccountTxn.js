const Transaction = require("../../models/TransactionHistory");
const Account = require("../../models/Account");
const mongooseUtil = require("mongoose");
const ObjectId = mongooseUtil.Types.ObjectId;

module.exports = async (req, res) => {
  console.log("Get transaction by Account");

  let loggedInUserId = new ObjectId(req.userId);
  let accountNum = req.params.accountNumber;

  let targetAcc;

  await Account.findOne({
    accountNumber: accountNum,
  }).exec(async (err, acc) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (acc && !acc.ownerId.equals(loggedInUserId)) {
      res
        .status(400)
        .send({ message: "Invalid account or invalid user access!" });
    } else {
      targetAcc = acc;

      await Transaction.find({
        $or: [{ accountFrom: targetAcc._id }, { accountTo: targetAcc._id }],
      })
        .sort("-timestamp")
        .exec((err, transaction) => {
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
    }
  });
};
