const Account = require("../../models/Account");
const Customer = require("../../models/Customer");
const ethereumjs = require("ethereumjs-wallet");

const generateWallet = () => {
  // generate a new random wallet
  const wallet = ethereumjs["default"].generate();

  // get the private key in hex format
  const privateKey = wallet.getPrivateKeyString();

  // get the address
  const address = "0x" + wallet.getAddressString();

  return {
    address,
    privateKey,
  };
};

const generateAccountNumber = () => {
  let num = "";
  while (num.length < 4) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
};

module.exports = (req, res) => {
  Customer.findOne({
    email: req.body.email,
        currency: req.body.currency,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    const { address, privateKey } = generateWallet();

    const account = new Account({
      accountNumber: generateAccountNumber(),
      walletAdrHash: address,
      walletPKHash: privateKey,
      balance: 1000,
      ownerId: user._id,
      currency: currency
    });

    account.save((err, account) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({
        message:
          "Account " +
          account.accountNumber +
          " was registered successfully for " +
          user.username,
      });
    });
  });
};
