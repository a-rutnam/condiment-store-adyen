require('dotenv').config()
const axios = require('axios');


const BASE_URL = 'https://checkout-test.adyen.com/v64';

module.exports = {

  getPaymentMethods: (userData) => {
    return axios.post(`${ BASE_URL }/paymentMethods`, {
      "merchantAccount": "Arutnam2020",
      "countryCode": "DK",
      "amount": {
        "currency": userData.amount.currency,
        "value": userData.amount.value
      },
      "channel": userData.channel,
      "shopperLocale": "en-US"
    },
    {
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      }
    });
  }, // getPaymentMethods


  createPayment: (body) => {
    return axios.post( `${ BASE_URL }/payments`, {
      amount: {
        "currency": body.amount.currency,
        "value": body.amount.value
      },
      "reference":"Anusha_checkoutChallenge",
      "paymentMethod": body.paymentMethod,
      "returnUrl": "http://localhost:5000/handleShopperRedirect", //TODO: config const?
      "merchantAccount":"Arutnam2020",
      "channel": "Web",
      "additionalData":{
        "allow3DS2":true
       },
       "browserInfo": body.browserInfo,
       "storePaymentMethod": true
       // ,
       // "redirectFromIssuerMethod": "GET",
       // "redirectToIssuerMethod": "GET",
    },
    {
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      }
    });
  }, // createPayment()


  createRedirectPayment: (gatewayRequest) => {

    return axios.post(`${ BASE_URL }/payments/details`, {
      "paymentData": gatewayRequest.paymentData,
      "details": gatewayRequest.details.payload
    },
    {
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      }
    });
    debugger
  }  // createRedirectPayment


}; // module.exports
