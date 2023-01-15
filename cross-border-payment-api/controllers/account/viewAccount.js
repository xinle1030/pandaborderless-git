const Account = require("../../models/Account");

module.exports = (req, res) => {
  Account.findOne({
    accountNumber: req.params.accountNumber,
  }).exec((err, acc) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (acc) {
      return res.status(200).send(acc);
    } else {
      res.status(400).send({ message: "No such account exists!" });
    }
  });
};
