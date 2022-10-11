const { get } = require("./service");

async function getCurrencyRate(targetCurrency, sourceCurrency = "USD") {
    if(targetCurrency == sourceCurrency) return 1;
    var headers = {
        "apikey": "hr3SPSY64qBsN6203CfPX4ZOFDsnJi6K"
    };
    const url = 'https://api.apilayer.com/currency_data/live';
    const params = { currencies: targetCurrency, source: sourceCurrency };

    const result = await get(url, headers, params);
    const currencyRate = result.quotes[sourceCurrency+targetCurrency];
    return currencyRate;
}

module.exports = { getCurrencyRate };

