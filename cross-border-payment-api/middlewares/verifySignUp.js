const Customer = require("../models/Customer");
const Account = require("../models/Account");

checkDuplicateAccEmail = async (req, res, next) => {
  await Customer.findOne({
    email: req.body.email,
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      await Account.findOne({ ownerId: user._id }).exec((err, account) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (account) {
          res
            .status(400)
            .send({ message: "Failed! Account ady exists with the email!" });
          return;
        } else {
          next();
        }
      });
    } else {
      res.status(400).send({ message: "Failed! No customer account!" });
      return;
    }
  });
};

checkDuplicateEmail = async (req, res, next) => {
  await Customer.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }

    next();
  });
};

checkDuplicateUsername = async (req, res, next) => {
  // Username
  await Customer.findOne({
    username: req.body.username,
  }).exec(async (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    next();
  });
};

const verifySignUp = {
  checkDuplicateUsername,
  checkDuplicateEmail,
  checkDuplicateAccEmail,
};

module.exports = verifySignUp;
