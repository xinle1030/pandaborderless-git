const { ObjectID } = require("bson");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Account = require("../models/Account");

/**
@function verifyToken
@desc A middleware function to verify if the user has provided a valid JSON Web Token.
@param {Object} req - Express request object
@param {Object} res - Express response object
@param {Function} next - Express next middleware function
@returns {Function} If no token is provided, it returns a status code of 403 with a message. If the token is invalid, it returns a status code of 401 with a message. If the token is valid, it sets the userId in the request object and calls the next middleware function.
*/
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

/**
@function verifyAcc
@desc A middleware function to verify if the user has access to the account they want to transfer from.
@param {Object} req - Express request object
@param {Object} res - Express response object
@param {Function} next - Express next middleware function
@returns {Function} If there is an error while retrieving the account, it returns a status code of 500 with the error message. If the user does not have access to the account, it returns a status code of 400 with a message. If the user has access to the account, it calls the next middleware function.
*/
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
