const { authJwt } = require("../middlewares");
const viewCustomer = require("../controllers/customer/viewCustomer");

const BASE_URL = "/api/customer";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(BASE_URL + "/", [authJwt.verifyToken], viewCustomer);
};
