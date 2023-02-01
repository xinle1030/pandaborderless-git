const { authJwt } = require("../middlewares");
const createAccount = require("../controllers/account/createAccount");
const viewAccount = require("../controllers/account/viewAccount");
const updateAccount = require("../controllers/account/updateAccount");
const viewAccountTxn = require("../controllers/account/viewAccountTxn");

// Base URL for the account endpoints
const BASE_URL = "/api/account";

module.exports = function (app, lms, web3) {
  // Middleware that sets the Access-Control-Allow-Headers header for incoming requests
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // POST endpoint for creating a new account
  // Uses the `authJwt.verifyToken` middleware to verify the JWT token in the request header
  app.post(BASE_URL + "/", [authJwt.verifyToken], createAccount);

  // GET endpoint for viewing an account's information
  app.get(BASE_URL + "/:accountNumber", [authJwt.verifyToken], viewAccount);

  // GET endpoint for viewing an account's transactions
  app.get(
    BASE_URL + "/:accountNumber/transaction",
    [authJwt.verifyToken],
    viewAccountTxn
  );

  // PUT endpoint for updating an account
  app.put(
    BASE_URL + "/transfer",
    [authJwt.verifyToken, authJwt.verifyAcc],
    (req, res) => {
      console.log(lms._address);
      updateAccount(req, res, lms, web3);
    }
  );
};
