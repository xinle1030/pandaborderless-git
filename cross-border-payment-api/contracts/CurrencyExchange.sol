// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract CurrencyExchange {

    mapping(address => mapping(string => mapping(string => uint256))) public balances;

    // Store the exchange rate
    mapping(string => mapping(string => uint256)) public exchangeRates;

    function updateExchangeRate(string memory _fromCurrency, string memory _toCurrency, uint256 _rate)
        public
    {
        exchangeRates[_fromCurrency][_toCurrency] = _rate;
    }

function exchange(address _user, uint256 _fromAmount, string memory _fromCurrency, string memory _toCurrency) public returns (bool) {
    // retrieve the exchange rate from the smart contract
    require(exchangeRates[_fromCurrency][_toCurrency] > 0, "Exchange rate not set");
    // calculate the converted amount
    uint256 convertedAmount = _fromAmount * exchangeRates[_fromCurrency][_toCurrency];
    // update the user balance
    balances[_user][_fromCurrency][_toCurrency] += convertedAmount;
    return true;
}

function updateUserBalance(address _user, string memory _fromCurrency, string memory _toCurrency, uint256 _amount) public returns (bool) {
    balances[_user][_fromCurrency][_toCurrency] = _amount;
    return true;
}

}