const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// const privateKeys = require("./config/secrets");
const fs = require("fs");
const pandaCoinContract = JSON.parse(
  fs.readFileSync("./build/contracts/PandaCoin.json", "utf8")
);
const CONTRACT_ABI = pandaCoinContract.abi;
//const CONTRACT_ABI = require("./ABI");

// Input variables
const contractAddress = "0x92F283FaC9b77c0a91C320fFA921b7423294D3da"; // PandaCoin contract on Goerli Testnet

const privateKey =
  "4f0b6e7d3217fc93e062f6b3d6dc0cb53278870bf1f02fb8ab86d317eadcd07a"; // lilmeow's metamask account PK
const account_address_from = "0x973C7Bb7AB40C15Ae4d248e4034878e0Df3f92c8"; // lilmeow's metamask address with many panda coins
const account_address_to = "0xE4f4b37F70fEDAA6F2Eea10995a09fC4C16986Da"; // lilmeow2's metamask address with little panda coins

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
      gas: 50000,
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
