const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

// converts a specified amount of currency from one currency to another, using an exchange rate API. 
// it returns the converted amount and the exchange rate.
const fxConvert = async (fromCurrency, toCurrency, amount) => {
  let convertedAmount = amount;
  let exchangeRate = 1;

  if (fromCurrency != toCurrency) {
    var myHeaders = new Headers();
    myHeaders.append("apikey", process.env.EXCHANGE_RATE_API_KEY);

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    let todayDate = new Date();
    let todayDateStr = todayDate.toISOString().split("T")[0];

    // GET the exchange rate
    await fetch(
      `https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}&date=${todayDateStr}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        convertedAmount =
          Math.round((result.result + Number.EPSILON) * 100) / 100;
          exchangeRate = result.info.rate;
      })
      .catch((error) => console.log("error", error));
  }
  return {convertedAmount, exchangeRate};
};

// converts a specified amount of Singapore Dollar (SGD) to PDC (Panda Depository Company) currency, 
// with a conversion rate of 100 PDC per SGD.
const SGDtoPDC = async (amountInSGD) => {
    return amountInSGD * 100;
};

// converts a specified amount of PDC to SGD, with a conversion rate of 100 PDC per SGD.
const PDCtoSGD = async (amountInPDC) => {
  return amountInPDC / 100;
};

module.exports = {
  fxConvert,
  SGDtoPDC,
  PDCtoSGD
};
