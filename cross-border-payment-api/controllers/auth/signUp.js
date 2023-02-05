const Customer = require("../../models/Customer");
var bcrypt = require("bcryptjs");

module.exports = (req, res) => {
  // create new customer
  const user = new Customer({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  // save to db
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Customer was registered successfully!" });
  });
};
