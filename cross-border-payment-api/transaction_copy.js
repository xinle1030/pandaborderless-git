const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// const privateKeys = require("./config/secrets");
const fs = require("fs");
const pandaCoinContract = JSON.parse(
  fs.readFileSync("./build/contracts/PandaCoin.json", "utf8")
);
const CONTRACT_ABI = pandaCoinContract.abi;
//const CONTRACT_ABI = require("./ABI");

// reconstruct inputs
const accountFrom = {
  privateKey: privateKey,
  address: account_address_from,
};
const addressTo = account_address_to;
const value = 1;

// connect a eth node
const provider =
  "https://eth-goerli.nownodes.io/6d0dc893-1c8d-449c-b2aa-5d5ab863a7c5";
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

// create contract
let contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

// create transfer data
const amount = web3.utils.toBN(value);
const data = contract.methods.transfer(addressTo, amount).encodeABI();

// show balance
const showBalance = async (contract, accountFrom, addressTo) => {
  var accountFromBalance = await contract.methods.balanceOf(accountFrom).call();
  var accountToBalance = await contract.methods.balanceOf(addressTo).call();
  console.log(
    "Account at address: " +
      accountFrom +
      " has balance of: " +
      accountFromBalance +
      " tokens"
  );
  console.log(
    "Account at address: " +
      addressTo +
      " has balance of: " +
      accountToBalance +
      " tokens"
  );
};

// Create send function
const send = async (accountFrom, addressTo) => {
  showBalance(contract, accountFrom.address, addressTo);

  console.log(
    `Attempting to send transaction from ${accountFrom.address} to ${addressTo}`
  );

  // Sign transaction with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      gas: 22000,
      to: contractAddress,
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

  showBalance(contract, accountFrom.address, addressTo);
};

// Call send function
send(accountFrom, addressTo);
