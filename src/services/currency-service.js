const { get } = require("./service");

async function getCurrencyRate(amount, targetCurrency, sourceCurrency = "USD") {

    var myHeaders = new Headers();
    myHeaders.append("apikey", "hr3SPSY64qBsN6203CfPX4ZOFDsnJi6K");
    const url = 'https://api.apilayer.com/currency_data/convert';
    const params = { to: targetCurrency, from: sourceCurrency, amount: amount };

    const result = get(url, myHeaders, params);
    return result;
}



module.exports = { getCurrencyRate };