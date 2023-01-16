const viewTransactionById = require("../controllers/transaction/viewTransactionById");
const viewTransaction = require("../controllers/transaction/viewTransaction");

const BASE_URL = "/api/transaction";

module.exports = function (app) {
  app.get(BASE_URL + "/", viewTransaction);

  app.get(BASE_URL + "/:transactionHash", viewTransactionById);
};
