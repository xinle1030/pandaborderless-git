const { ObjectID } = require("bson");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Account = require("../models/Account");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

verifyAcc = async (req, res, next) => {
  let { accountFrom, accountTo, amountToTransfer } = req.body;
  let loggedUserId = req.userId;

  await Account.findOne({
    $and: [
      { accountNumber: accountFrom },
      { ownerId: new ObjectID(loggedUserId) },
    ],
  }).exec(async (err, account) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (account) {
      console.log(account);
      next();
    } else {
      res
        .status(400)
        .send({ message: "Failed! No account access for transfer!" });
      return;
    }
  });
};

const authJwt = {
  verifyToken,
  verifyAcc,
};
module.exports = authJwt;
