const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const app = express();
const mongoose = require("mongoose");

const privateKeys = [
  "2272c2c88ac4da5cbfce93cdd932b90a401f118ca1728f27bb9b8d32800ef21e",
  "83f220e4facae332e0b5eba61ea3d9725d0a9a69be446833baaeeb7d5d69637d",
  "f2cec934251fc51007ef0df7be47949e745dcb90aa9a4179a1f0f408ff8ffda9",
];
const contractAddress = "0x0D286DA74A480cd26BBaC899930dCE81600443aE";

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cors for cross origin requesters to the frontend application
app.use(cors());

app.set("trust proxy", true);

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const contract = require("truffle-contract");
const artifacts = require("./build/contracts/PandaCoin.json");
// const privateKeys = require("./config/secrets");
const fs = require("fs");
const pandaCoinContract = JSON.parse(
  fs.readFileSync("./build/contracts/PandaCoin.json", "utf8")
);
const CONTRACT_ABI = pandaCoinContract.abi;

if (typeof web3 !== "undefined") {
  var web3 = new Web3(web3.currentProvider);
} else {
  // connect a eth node
  let host = new HDWalletProvider(
    privateKeys,
    "http://127.0.0.1:7545",
    0,
    3,
    false
  );

  var web3 = new Web3(host);
}

// create contract
// let pandaCoinContract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

const LMS = contract(artifacts);
LMS.setProvider(web3.currentProvider);

mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
      console.log("DB connected");
      // const db = client.db("Cluster0");
      const accounts = await web3.eth.getAccounts();
      const lms = await LMS.deployed();
      //const lms = LMS.at(contract_address) for remote nodes deployed on ropsten or rinkeby

      // routes
      require("./routes/index")(app, lms, accounts);
      require("./routes/payments")(app, lms, accounts);
      require("./routes/auth.routes")(app);
      require("./routes/user.routes")(app);

      // Server Setup
      const PORT = process.env.PORT || 3333;
      if (process.env.NODE_ENV !== "test") {
        app.listen(PORT, () => {
          console.log(`Server is running at PORT ${PORT}`);
        });
      }
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

module.exports = app;
