require('dotenv').config()
const axios = require('axios');


const BASE_URL = 'https://checkout-test.adyen.com/v53';

module.exports = {

  getPaymentMethods: function( userData ){
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

  createPayment: function(gatewayRequest){
    return axios( gatewayRequest );
  }, // createPayment

  createRedirectPayment: function(gatewayRequest){
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
