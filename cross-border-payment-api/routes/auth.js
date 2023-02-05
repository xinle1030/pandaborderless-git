const { verifySignUp } = require("../middlewares");
const signUp = require("../controllers/auth/signUp");
const signIn = require("../controllers/auth/signIn");

const BASE_URL = "/api/auth";

module.exports = function (app) {
  // Add middleware to set "Access-Control-Allow-Headers" header in the response
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Route for user signup
  // Verify signup information by calling the checkDuplicateUsername and checkDuplicateEmail middlewares
  // If signup information is valid, call the signUp controller
  app.post(
    BASE_URL + "/signup",
    [verifySignUp.checkDuplicateUsername, verifySignUp.checkDuplicateEmail],
    signUp
  );

  // Route for user signin
  // Call the signIn controller to handle the signin request
  app.post(BASE_URL + "/signin", signIn);
};
