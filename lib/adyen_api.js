require('dotenv').config()
const axios = require('axios');


const BASE_URL = 'https://checkout-test.adyen.com/v53';

module.exports = {

  getPaymentMethods: ( userData ) => {
    return axios({
      method: 'POST',
      url: `${ BASE_URL }/paymentMethods`,
      data: {
        "merchantAccount": "AdyenRecruitmentCOM",
        "countryCode": "AU",
        "amount": {
          "currency": userData.amount.currency,
          "value": userData.amount.value
        },
        "channel": userData.channel,
        "shopperLocale": "en-US"
      },
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      },
    })
  }, // getPaymentMethods

  createPayment: (body) => {

    const gatewayRequest = {
      method: 'POST',
      // TODO: extract base URL to config constant
      url: 'https://checkout-test.adyen.com/v53/payments',
      data: {
        amount: {
          // TODO: remove quotes from keys
          "currency": body.amount.currency,
          "value": body.amount.value
        },
        "reference":"YOUR_ORDER_NUMBER", //TODO: use DB order_id?
        "paymentMethod": body.paymentMethod,
        "returnUrl": "http://localhost:5000/handleShopperRedirect", //TODO: config const?
        "merchantAccount":"AdyenRecruitmentCOM",
        "channel": "Web",
        "additionalData":{
          "allow3DS2":true
         },
         "browserInfo": body.browserInfo
      },
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      },
    };

    return axios( gatewayRequest );
  }, // createPayment()

  createRedirectPayment: (gatewayRequest) => {
    return axios({
      method: 'POST',
      url: "https://checkout-test.adyen.com/v53/payments/details",
      data: {
        "paymentData": gatewayRequest.paymentData,
        "details": gatewayRequest.details
      },
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      }
    });
  },  // createRedirectPayment

}; //module exports
