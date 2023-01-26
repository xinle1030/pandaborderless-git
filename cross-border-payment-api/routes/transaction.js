const { authJwt } = require("../middlewares");
const viewTransactionByHash = require("../controllers/transaction/viewTransactionByHash");
const viewAllTransaction = require("../controllers/transaction/viewAllTransaction");

const BASE_URL = "/api/transaction";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(BASE_URL + "/all", viewAllTransaction);

  app.get(BASE_URL + "/:transactionHash", viewTransactionByHash);

};
