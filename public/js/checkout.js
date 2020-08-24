// const api = require('./lib/merchant_api');
const MERCHANT_API_PAYMENT_METHODS_URL = '/api/payment_methods';
const MERCHANT_API_CREATE_PAYMENT_URL = '/api/create_payment';

// clearing cookies to clear unwanted state
document.cookie = 'order_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
document.cookie = 'paymentData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

console.log('hi!', AdyenCheckout);

document.addEventListener("DOMContentLoaded", () => {

  const submitButton = document.querySelector("#submitPaymentDetails");

  submitButton.addEventListener("click", async () => {

    const amount = document.querySelector("#amount").value;
    const currency = document.querySelector("#currency").value;


    const fakeUserData = {
      amount: {
        currency: currency,
        // to convert input, human readable amount to minor units. This is brittle and needs to be reconfigured for non-minor unit currencies
        value: parseFloat(amount) * 100
      },
      channel: "Web"
    };

    // Make request to merchant server which forwards request to Adyen gateway
    try {

      const response = await axios.post(MERCHANT_API_PAYMENT_METHODS_URL, { fakeUserData });

      const configuration = createConfig(response.data, CLIENT_KEY, fakeUserData);
      const checkout = new AdyenCheckout(configuration);
      const dropin = checkout.create('dropin').mount('#dropin-container');

    } catch(err) {
      console.log("error:", err);
    }

  });  //submit button click handler


  // Automatically submit amount form in debug mode ('/checkout?debug')
  // for faster testing
  const urlParams = new URLSearchParams(window.location.search);
  const debugMode = urlParams.get('debug') !== null;
  if( debugMode ){
    submitButton.click();
  }


}); // DOM ready handler

// Convenience function to create config object,
// passing in the required fields
const createConfig = (paymentMethods, clientKey, fakeUserData) => {
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
          // TODO: this is duped in redirect backend code, try to refactor
          document.cookie = 'order_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

          // Report status to UI
          dropin.setStatus(paymentResponse.data.status, paymentResponse.data.message);
        }

      } catch(err) {
        console.log('GATEWAY ERROR');
        console.dir(err);
        dropin.setStatus('error', { message: 'Something went wrong.'});

      }

    } //onSubmit handler
  }; //return

}; // createConfig()
