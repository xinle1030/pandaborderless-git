const Account = require("../models/Account");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const PANDA_ACC = process.env.PDC_OWNER_ACC;

// get account details
const retrieveDocumentByAccountNumber = async (accountNumber) => {
  try {
    const doc = await Account.findOne({ accountNumber: accountNumber }).exec();
    return doc;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get PK and wallet address of from wallet
const getPDCOwner = async () => {
  const owner = await retrieveDocumentByAccountNumber(PANDA_ACC);
  return owner;
};

// deduct account balance
const deductBalance = async (accountNumber, value) => {
  try {
    const account = await Account.findOne({ accountNumber });
    if (!account) throw new Error("Account not found.");
    account.balance -= value;
    await account.save();
    console.log("balance deducted");
    return account;
  } catch (error) {
    throw error;
  }
};

// increase account balance
const increaseBalance = async (accountNumber, value) => {
  try {
    // round value to 2dc
    value = Number(value);
    if (isNaN(value)) throw new Error("Invalid value, it must be a number");
    value = Math.round(value * 100) / 100;

    const account = await Account.findOne({ accountNumber });
    if (!account) throw new Error("Account not found.");
    account.balance += value;
    await account.save();
    console.log("balance increased");
    return account;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  retrieveDocumentByAccountNumber,
  getPDCOwner,
  deductBalance,
  increaseBalance,
};
