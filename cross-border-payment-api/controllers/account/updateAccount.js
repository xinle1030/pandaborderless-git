const dotenv = require("dotenv");
dotenv.config({ path: "../../config/.env" });
const accUtils = require("../../utils/acc_utils");
const fxUtils = require("../../utils/fx_utils");
const txnUtils = require("../../utils/txn_utils");
const mongoose = require("mongoose");

const PEG_CURRENCY = process.env.PEG_CURRENCY;

module.exports = async (req, res, lms, web3) => {
  let { accountFrom, accountTo, amountToTransfer } = req.body;

  // variables
  const owner = await accUtils.getPDCOwner();
  const sender = await accUtils.retrieveDocumentByAccountNumber(accountFrom);
  const receiver = await accUtils.retrieveDocumentByAccountNumber(accountTo);

  // check if balance is sufficient
  if (amountToTransfer > sender.balance) {
    const error = "Sender Account Balance not sufficient!";
    res.status(400).send({ message: error });
    throw new Error(error);
  }

  const fromCurrency = sender.currency;
  const toCurrency = receiver.currency;

  // converts the amount to be transferred
  let fxRes1 = await fxUtils.fxConvert(
    fromCurrency,
    PEG_CURRENCY,
    amountToTransfer
  );

  let convertAmount = fxRes1.convertedAmount;
  let exchangeRate = fxRes1.exchangeRate;

  console.log(convertAmount);
  console.log(exchangeRate);

  // converts the converted amount from peg currency to the PDC (native token)
  let convertAmountInPDC = await fxUtils.SGDtoPDC(convertAmount);

  // starts a transaction session using mongoose
  const session = await mongoose.startSession();
  session.startTransaction();

  // issue transactions
  try {
    // PANDA ACC to RECEIVER
    const hash1 = await txnUtils.makeTransaction(
      owner,
      receiver,
      convertAmountInPDC,
      web3,
      lms
    );

    // RECEIVER to PANDA ACC
    const hash2 = await txnUtils.makeTransaction(
      receiver,
      owner,
      convertAmountInPDC,
      web3,
      lms
    );

    console.log(hash1);
    console.log(hash2);

    // post transactions check
    if (hash1 && hash2) {
      let receivedAmountInSGD = await fxUtils.PDCtoSGD(convertAmountInPDC);

      let fxRes2 = await fxUtils.fxConvert(
        PEG_CURRENCY,
        toCurrency,
        receivedAmountInSGD
      );

      let receivedAmount = fxRes2.convertedAmount;
      let exchangeBackRate = fxRes2.exchangeRate;

      // updates the balance of the sender and receiver accounts
      try {
        await accUtils.deductBalance(accountFrom, amountToTransfer);
        await accUtils.increaseBalance(accountTo, receivedAmount);

        // creates a transaction history
        let transactionHistory = await txnUtils.createTxnHistory(
          sender,
          receiver,
          amountToTransfer,
          hash1,
          hash2,
          exchangeRate,
          exchangeBackRate
        );

        await session.commitTransaction();
        session.endSession();

        // response the transaction history object
        res.json(transactionHistory);
      } catch (err) {
        // aborts the transaction session
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        return res.status(500).json("Bank account update and transaction fail");
      }
    } else {
      // aborts the transaction session
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json("Wallet transaction fail");
    }
  } catch (err) {
    // aborts the transaction session
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res.status(500).json("Server Error");
  }
};
