const PandaCoin = artifacts.require("./PandaCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(PandaCoin);
};
