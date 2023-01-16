const Account = require("../../models/Account");
const Customer = require("../../models/Customer");
const ethereumjs = require("ethereumjs-wallet");
const Web3 = require("web3");

// get account details
async function retrieveDocumentByAccountNumber(accountNumber) {
  try {
    const doc = await Account.findOne({ accountNumber: accountNumber }).exec();
    return doc;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const exchangeRate = async (sender, receiver, amount, FX_LMS, res) => {
  const fromCurrency = sender.currency;
  const toCurrency = receiver.currency;
  const fromAddr = sender.walletAdrHash;
  const toAddr = receiver.walletAdrHash;

  // Update the exchange rate
  FX_LMS.methods
    .updateExchangeRate(fromCurrency, toCurrency, 3)
    .send({ from: fromAddr }, (error, transactionHash) => {
      if (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
      } else {
        console.log(transactionHash);
      }
    });

  // Exchange currency
  FX_LMS.methods
    .exchange(fromAddr, amount, fromCurrency, toCurrency)
    .send({ from: fromAddr }, (error, transactionHash) => {
      if (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
      } else {
        res.json({ success: true, transactionHash });
        console.log(transactionHash);
      }
    });
};

module.exports = async (req, res, FX_LMS) => {
  let { accountFrom, accountTo, amountToTransfer } = req.body;

  const sender = await retrieveDocumentByAccountNumber(accountFrom);
  const receiver = await retrieveDocumentByAccountNumber(accountTo);

  exchangeRate(sender, receiver, amountToTransfer, FX_LMS, res);
};
