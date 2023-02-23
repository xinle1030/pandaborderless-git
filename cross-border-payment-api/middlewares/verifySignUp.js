const Customer = require("../models/Customer");
const Account = require("../models/Account");

// This function checks if the customer's email address has already been used for an account.
// If it has, it checks if an account has already been created for that customer.
// If both conditions are true, it sends an error response indicating that the email address is already in use.
// If no customer account exists with the email address, it sends an error response indicating that there is no customer account.
// If no error occurs, it calls the next middleware function.
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

// This function checks if the customer's email address has already been used for an account.
// If it has, it sends an error response indicating that the email address is already in use.
// If no error occurs, it calls the next middleware function.
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

// This function checks if the customer's username has already been used for an account.
// If it has, it sends an error response indicating that the username is already in use.
// If no error occurs, it calls the next middleware function.
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
