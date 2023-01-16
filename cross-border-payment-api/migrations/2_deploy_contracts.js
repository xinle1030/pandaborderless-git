const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const PandaCoin = artifacts.require("./PandaCoin.sol");
const CurrencyExchange = artifacts.require("./CurrencyExchange.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage, 1000);
  deployer.deploy(PandaCoin);
  deployer.deploy(CurrencyExchange);
};
