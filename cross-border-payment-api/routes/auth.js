const { verifySignUp } = require("../middlewares");
const signUp = require("../controllers/auth/signUp");
const signIn = require("../controllers/auth/signIn");

const BASE_URL = "/api/auth";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    BASE_URL + "/signup",
    [verifySignUp.checkDuplicateUsername, verifySignUp.checkDuplicateEmail],
    signUp
  );

  app.post(BASE_URL + "/signin", signIn);
};
