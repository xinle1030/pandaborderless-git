const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

const BASE_URL = "/api/test";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(BASE_URL + "/all", controller.allAccess);

  app.get(BASE_URL + "/user", [authJwt.verifyToken], controller.userBoard);
};