const viewTransactionByHash = require("../controllers/transaction/viewTransactionByHash");
const viewTransaction = require("../controllers/transaction/viewTransaction");

const BASE_URL = "/api/transaction";

module.exports = function (app) {
  app.get(BASE_URL + "/", viewTransaction);

  app.get(BASE_URL + "/:transactionHash", viewTransactionByHash);
};
