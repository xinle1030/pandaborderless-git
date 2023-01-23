const Account = require("../models/Account");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const fxConvert = async (fromCurrency, toCurrency, amount) => {
  let convertedAmount = amount;

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

    await fetch(
      `https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}&date=${todayDateStr}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        convertedAmount =
          Math.round((result.result + Number.EPSILON) * 100) / 100;
      })
      .catch((error) => console.log("error", error));
  }
  return convertedAmount;
};

const SGDtoPDC = async (amountInSGD) => {
    return amountInSGD * 100;
};

const PDCtoSGD = async (amountInPDC) => {
  return amountInPDC / 100;
};

module.exports = {
  fxConvert,
  SGDtoPDC,
  PDCtoSGD
};
