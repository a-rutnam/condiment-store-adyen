require('dotenv').config()
const axios = require('axios');


const BASE_URL = 'https://checkout-test.adyen.com/v53';

module.exports = {

  getPaymentMethods: (userData) => {
    return axios.post(`${ BASE_URL }/paymentMethods`, {
      "merchantAccount": "AdyenRecruitmentCOM",
      "countryCode": "AU",
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
        // TODO: remove quotes from keys
        "currency": body.amount.currency,
        "value": body.amount.value
      },
      "reference":"Anusha_checkoutChallenge",
      "paymentMethod": body.paymentMethod,
      "returnUrl": "http://localhost:5000/handleShopperRedirect", //TODO: config const?
      "merchantAccount":"AdyenRecruitmentCOM",
      "channel": "Web",
      "additionalData":{
        "allow3DS2":true
       },
       "browserInfo": body.browserInfo
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
      "details": gatewayRequest.details
    },
    {
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      }
    });
  }  // createRedirectPayment


}; // module.exports
