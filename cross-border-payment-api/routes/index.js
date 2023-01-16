const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const BASE_URL = "/api/payments/crossborder";

module.exports = function (app) {
  app.get("/", (req, res) => {
    res.send("Welcome to cross border payment platform");
  });
};