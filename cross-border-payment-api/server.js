const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const app = express();
const mongoose = require("mongoose");

const contractAddress = process.env.pdcContractAddress;
const fXContractAddr = process.env.fXContractAddr;

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cors for cross origin requesters to the frontend application
app.use(cors());

app.set("trust proxy", true);

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const privateKeys = require("./config/secrets.js");
const fs = require("fs");

if (typeof web3 !== "undefined") {
  var web3 = new Web3(web3.currentProvider);
} else {
  // connect a eth node - on goerli
  // const provider =
  //   "https://eth-goerli.nownodes.io/6d0dc893-1c8d-449c-b2aa-5d5ab863a7c5";
  // var web3 = new Web3(new Web3.providers.HttpProvider(provider));
  
  // connect a eth node - on local network
  let host = new HDWalletProvider(
    privateKeys,
    "http://127.0.0.1:7545",
    0,
    3,
    false
  );

  var web3 = new Web3(host);
}

const pandaCoinContract = JSON.parse(
  fs.readFileSync("./build/contracts/PandaCoin.json", "utf8")
);
const CONTRACT_ABI = pandaCoinContract.abi;

const FXContract = JSON.parse(
  fs.readFileSync("./build/contracts/CurrencyExchange.json", "utf8")
);
const FX_CONTRACT_ABI = FXContract.abi;

// panda coin contract
const lms = new web3.eth.Contract(CONTRACT_ABI, contractAddress);
lms.setProvider(web3.currentProvider);

// currency exchange contract
const FX_LMS = new web3.eth.Contract(FX_CONTRACT_ABI, fXContractAddr);
FX_LMS.setProvider(web3.currentProvider);

console.log(lms._address);
console.log(FX_LMS._address);
console.log("==== check contract is deployed ====");

mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("DB connected");
    // const db = client.db("Cluster0");
    const accounts = await web3.eth.getAccounts();

    // routes
    require("./routes/index")(app);
    require("./routes/payments")(app, lms, web3);
    require("./routes/auth")(app);
    require("./routes/transaction")(app);
    require("./routes/account")(app, FX_LMS);

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
