const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth/auth.controller");

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
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.signup
  );

  app.post(BASE_URL + "/signin", controller.signin);
};
