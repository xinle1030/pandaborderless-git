const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
// const privateKeys = require("./config/secrets");
const fs = require("fs");
const pandaCoinContract = JSON.parse(
  fs.readFileSync("./build/contracts/PandaCoin.json", "utf8")
);
const CONTRACT_ABI = pandaCoinContract.abi;

// Input variables
const contractAddress = "0x0D286DA74A480cd26BBaC899930dCE81600443aE";

const privateKeys = [
  "2272c2c88ac4da5cbfce93cdd932b90a401f118ca1728f27bb9b8d32800ef21e",
  "83f220e4facae332e0b5eba61ea3d9725d0a9a69be446833baaeeb7d5d69637d",
  "f2cec934251fc51007ef0df7be47949e745dcb90aa9a4179a1f0f408ff8ffda9",
];
const account_addresses = [
  "0xcb895978b754Ad2Bea75dccF523ae65477aa1D75",
  "0xBa7ED57a028828ac8f22d25383610aB9Cf7F3f55",
  "0x7083F543DfAC7629f30DFC06C8FF5e2d4015d88f",
];

const accountFrom = {
  privateKey: privateKeys[1],
  address: account_addresses[1],
};
const addressTo = account_addresses[2];
const value = 1;

// connect a eth node
let host = new HDWalletProvider(
  privateKeys,
  "http://127.0.0.1:7545",
  0,
  3,
  false
);

const web3 = new Web3(host);

// create contract
let contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

// create transfer data
const amount = web3.utils.toBN(value);
const data = contract.methods.transfer(addressTo, amount).encodeABI();

const showBalance = async (accountFrom, addressTo) => {
  var accountFromBalance = web3.utils.fromWei(
    await web3.eth.getBalance(accountFrom.address)
  );
    var accountToBalance = web3.utils.fromWei(
      await web3.eth.getBalance(addressTo)
    );
  console.log(
    "Account at address: " +
      accountFrom.address +
      " has balance of: " +
      accountFromBalance
  );
  console.log(
    "Account at address: " +
      addressTo +
      " has balance of: " +
      accountToBalance
  );
};

// Create send function
const send = async (accountFrom, addressTo) => {
  showBalance(accountFrom, addressTo);

  console.log(
    `Attempting to send transaction from ${accountFrom.address} to ${addressTo}`
  );

  // Sign transaction with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      gas: 50000,
      to: addressTo,
      data: data,
    },
    accountFrom.privateKey
  );

  // Send transaction and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(
    `Transaction successful with hash: ${createReceipt.transactionHash}`
  );

  showBalance(accountFrom, addressTo);
};

// Call send function
send(accountFrom, addressTo);