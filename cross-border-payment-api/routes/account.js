const { authJwt, verifySignUp } = require("../middlewares");
const createAccount = require("../controllers/account/createAccount");
const viewAccount = require("../controllers/account/viewAccount");

const BASE_URL = "/api/account";

module.exports = function (app) {
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

  app.get(
    BASE_URL + "/:accountNumber",
    [authJwt.verifyToken],
    viewAccount
  );
};
