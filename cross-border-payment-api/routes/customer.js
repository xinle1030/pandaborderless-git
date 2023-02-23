const { authJwt } = require("../middlewares");
const viewCustomer = require("../controllers/customer/viewCustomer");

const BASE_URL = "/api/customer";

module.exports = function (app) {
  // Add middleware to set "Access-Control-Allow-Headers" header in the response
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Route for viewing customer information
  // Verify the token in the request header by calling the verifyToken middleware
  // If the token is valid, call the viewCustomer controller to retrieve customer information
  app.get(BASE_URL + "/", [authJwt.verifyToken], viewCustomer);
};
