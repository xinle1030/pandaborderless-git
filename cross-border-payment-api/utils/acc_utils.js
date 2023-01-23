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

const getPDCOwner = async () => {
  // get PK and wallet address of from wallet
  const owner = await retrieveDocumentByAccountNumber(PANDA_ACC);

  ownerWallet = owner.walletAdrHash;
  ownerPK = owner.walletPKHash;
  
  return { ownerWallet, ownerPK };
};

module.exports = {
  retrieveDocumentByAccountNumber,
  getPDCOwner,
};