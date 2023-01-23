const Account = require("../../models/Account");

// get account details
exports.retrieveDocumentByAccountNumber = async function (accountNumber) {
  try {
    const doc = await Account.findOne({ accountNumber: accountNumber }).exec();
    return doc;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// deduct account balance
exports.deductBalance = async function (accountNumber, value) {
  try {
    const account = await Account.findOne({ accountNumber });
    if (!account) throw new Error("Account not found.");
    account.balance -= value;
    await account.save();
    return account;
  } catch (error) {
    throw error;
  }
};

// increase account balance
exports.increaseBalance = async function (accountNumber, value) {
  try {
    value = Number(value);
    if (isNaN(value)) throw new Error("Invalid value, it must be a number");
    value = Math.round(value * 100) / 100;

    const account = await Account.findOne({ accountNumber });
    if (!account) throw new Error("Account not found.");
    account.balance += value;
    await account.save();
    return account;
  } catch (error) {
    throw error;
  }
};

// get currency and convert
exports.getCurrencyValue = async function (accountNumber, value) {
  try {
    const account = await Account.findOne({ accountNumber });
    if (!account) throw new Error("Account not found.");
    value = value / 100;
    const convertedValue = convertCurrency(value, account.currency);
    console.log("==== Converting currency ====")
    console.log(convertedValue)
    console.log(typeof convertedValue)
    return convertedValue;
  } catch (error) {
    throw error;
  }
};

// convert currency
function convertCurrency(value, currency) {
  let convertedValue;
  switch (currency) {
    case "MYR":
      convertedValue = value * 3.25;
      break;
    case "USD":
      convertedValue = value * 0.76;
      break;
    case "SGD":
      convertedValue = value;
      break;
    default:
      console.log(
        "Invalid or not found currency, defaulting to original value"
      );
      convertedValue = value;
  }
  return convertedValue;
}
