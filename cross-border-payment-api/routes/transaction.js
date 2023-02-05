const { authJwt } = require("../middlewares");
const viewTransactionByHash = require("../controllers/transaction/viewTransactionByHash");
const viewAllTransaction = require("../controllers/transaction/viewAllTransaction");

const BASE_URL = "/api/transaction";

module.exports = function (app) {
  // Add middleware to set "Access-Control-Allow-Headers" header in the response
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // View all transactions
  app.get(BASE_URL + "/all", viewAllTransaction);

  // View transaction by hash
  app.get(BASE_URL + "/:transactionHash", viewTransactionByHash);

};
