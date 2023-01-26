const Customer = require("../../models/Customer");
const Account = require("../../models/Account");

module.exports = (req, res) => {
  let loggedInUserId = req.userId;
  let accounts = [];

  Customer.findById(loggedInUserId, async (err, customer) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (customer) {
      console.log(customer);

      await Account.find({
        ownerId: customer._id,
      }).exec((err, acc) => {
        if (err) {
          throw err;
        }

        if (acc) {
          accounts = acc;
        }
        customer.accounts = accounts;
        let retCust = {...customer._doc, accounts: accounts};
        res.status(200).send(retCust);
      });
    } else {
      res.status(400).send({ message: "No such customer exists!" });
    }
  });
};
