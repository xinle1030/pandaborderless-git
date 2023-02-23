const Account = require("../../models/Account");
const Customer = require("../../models/Customer");
const ethereumjs = require("ethereumjs-wallet");

// Generate a new Metamask wallet.
const generateWallet = () => {
  // generate a new random wallet
  const wallet = ethereumjs["default"].generate();

  // get the private key in hex format
  const privateKey = wallet.getPrivateKeyString().substring(2);

  // get the address
  const address = wallet.getAddressString();

  return {
    address,
    privateKey,
  };
};

// Generate a random account Number with length 4.
const generateAccountNumber = () => {
  let num = "";
  while (num.length < 4) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
};

module.exports = (req, res) => {
  let { email, currency } = req.body;

  // Find the customer in the db based on the email
  Customer.findOne({
    email: email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // Generate a new wallet address and private key
    const { address, privateKey } = generateWallet();

    // Create a new account object
    const account = new Account({
      accountNumber: generateAccountNumber(),
      walletAdrHash: address,
      walletPKHash: privateKey,
      balance: 1000,
      ownerId: user._id,
      currency: currency,
    });

    // Save account to db
    account.save((err, account) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      return res.json(account);
    });
  });
};
