// const api = require('./lib/merchant_api');
const MERCHANT_API_PAYMENT_METHODS_URL = '/api/payment_methods';
const MERCHANT_API_CREATE_PAYMENT_URL = '/api/create_payment';

console.log('hi!', AdyenCheckout);
const fakeUserData = {
  amount: {
    currency: "AUD",
    value: 1000
  },
  channel: "Web"
};

document.addEventListener("DOMContentLoaded",  async () => {

  // TODO: frontend data to send to node. maybe unique order number needed - how should I best set this up for Adyen to flick through different options e.g. a bad data request with wrong currency for payment method

  // Make request to merchant server which forwards request to Adyen gateway
  try {

    const response = await axios.post(MERCHANT_API_PAYMENT_METHODS_URL, { fakeUserData });

    // Use response to build checkout UI
    const configuration = createConfig(response.data, CLIENT_KEY);
    const checkout = new AdyenCheckout(configuration);
    const dropin = checkout.create('dropin').mount('#dropin-container');

  } catch(err) {
    console.log("error:", err);
  }

}); // DOM ready handler

// Convenience function to create config object,
// passing in the required fields
const createConfig = (paymentMethods, clientKey) => {

  return {
    paymentMethodsResponse: paymentMethods,
    clientKey: clientKey,
    locale: "en-US",
    environment: "test",
    onSubmit: async (state, dropin) => {
      try {

        const paymentResponse = await axios.post(MERCHANT_API_CREATE_PAYMENT_URL, {
          paymentMethod: state.data.paymentMethod,
          browserInfo: state.data.browserInfo,
          // reuse fakeUserData from payment_methods call
          ...fakeUserData
        });

        // TODO: this needs to start over if the redirect returns an action again
        if (paymentResponse.data.action) {
          dropin.handleAction(paymentResponse.data.action);
        } else {
          // Report status to UI
          dropin.setStatus(paymentResponse.data.status, paymentResponse.data.message);
        }

      } catch(err) {
        // TODO: report error to UI
        console.dir(err);
      }

    } //onSubmit handler
  }; //return

}; // createConfig()
