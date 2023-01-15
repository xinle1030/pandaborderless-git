const Customer = require("../models/Customer");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  await Customer.findOne({
    username: req.body.username,
  }).exec(async (err, user) => {
    if (err) {
      console.log(err);
      console.log("xiao");
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
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
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;
