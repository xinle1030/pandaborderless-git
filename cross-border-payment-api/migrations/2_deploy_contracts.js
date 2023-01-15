const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const PandaCoin = artifacts.require("./PandaCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage, 1000);
  deployer.deploy(PandaCoin);
};
