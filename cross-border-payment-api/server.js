const express = require("express");
const cors = require("cors");

// const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./swagger-config/swagger.js");

dotenv.config({ path: "./config/.env" });

const app = express();

// cors for cross origin requesters to the frontend application
app.use(cors());
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// connectDB();

const indexRouter = require("./routes/index.js");
const paymentRouter = require("./routes/payments.js");

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", true);

app.use("/api/payments/crossborder", paymentRouter);
app.use("/", indexRouter);

// Server Setup
const PORT = process.env.PORT || 3333;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
}

module.exports = app;