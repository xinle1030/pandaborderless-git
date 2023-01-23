const Account = require("../../models/Account");
const Customer = require("../../models/Customer");
const ethereumjs = require("ethereumjs-wallet");
const Web3 = require("web3");
const dotenv = require("dotenv");
dotenv.config({ path: "../../config/.env" });
const accUtils = require("../../utils/acc_utils");
const fxUtils = require("../../utils/fx_utils");

const PEG_CURRENCY = process.env.PEG_CURRENCY;



const ownerToSender = async (owner, senderAddr, amount) => {
  let ownerAddr = owner.ownerWallet;
  let ownerPK = owner.ownerPK;


};

const makeTransaction = async (sender, receiver, amount, lms) => {
  const fromCurrency = sender.currency;
  const toCurrency = receiver.currency;

  const fromAddr = sender.walletAdrHash;
  const toAddr = receiver.walletAdrHash;

  let convertAmount = await fxUtils.fxConvert(
    fromCurrency,
    PEG_CURRENCY,
    amount
  );
  let convertAmountInPDC = await fxUtils.SGDtoPDC(convertAmount);

  console.log(convertAmountInPDC);

  const owner = await accUtils.getPDCOwner();

  // // Update the exchange rate
  // FX_LMS.methods
  //   .updateExchangeRate(fromCurrency, toCurrency, 3)
  //   .send({ from: fromAddr }, (error, transactionHash) => {
  //     if (error) {
  //       console.log(error);
  //       res.json({ success: false, error: error.message });
  //     } else {
  //       console.log(transactionHash);
  //     }
  //   });

  // // Exchange currency
  // FX_LMS.methods
  //   .exchange(fromAddr, amount, fromCurrency, toCurrency)
  //   .send({ from: fromAddr }, (error, transactionHash) => {
  //     if (error) {
  //       console.log(error);
  //       res.json({ success: false, error: error.message });
  //     } else {
  //       res.json({ success: true, transactionHash });
  //       console.log(transactionHash);
  //     }
  //   });
};

module.exports = async (req, res, lms) => {
  let { accountFrom, accountTo, amountToTransfer } = req.body;

  const sender = await accUtils.retrieveDocumentByAccountNumber(accountFrom);
  const receiver = await accUtils.retrieveDocumentByAccountNumber(accountTo);

  makeTransaction(sender, receiver, amountToTransfer, lms);
  // res.send(fxConvert(fromCurrency, toCurrency, amountToTransfer));

  // exchangeRate(sender, receiver, amountToTransfer, FX_LMS, res);
};
