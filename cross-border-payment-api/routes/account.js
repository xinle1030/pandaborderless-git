const { authJwt, verifySignUp } = require("../middlewares");
const createAccount = require("../controllers/account/createAccount");
const viewAccount = require("../controllers/account/viewAccount");
const updateAccount = require("../controllers/account/updateAccount");
const viewAccountTxn = require("../controllers/account/viewAccountTxn");

const BASE_URL = "/api/account";

module.exports = function (app, lms, web3) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    BASE_URL + "/",
    [authJwt.verifyToken, verifySignUp.checkDuplicateAccEmail],
    createAccount
  );

  app.get(BASE_URL + "/:accountNumber", [authJwt.verifyToken], viewAccount);

  app.get(
    BASE_URL + "/:accountNumber/transaction",
    [authJwt.verifyToken],
    viewAccountTxn
  );

  // app.put(BASE_URL + "/transfer", [authJwt.verifyToken], (req, res) => {
  //   console.log(LMS._address);
  //   updateAccount(req, res, LMS);
  // });

  app.put(BASE_URL + "/transfer", (req, res) => {
    console.log(lms._address);
    updateAccount(req, res, lms, web3);
  });
};
