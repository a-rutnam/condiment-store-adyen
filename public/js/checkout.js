// const api = require('./lib/merchant_api');
const MERCHANT_API_PAYMENT_METHODS_URL = '/api/payment_methods';
const MERCHANT_API_CREATE_PAYMENT_URL = '/api/create_payment';


console.log('hi!', AdyenCheckout);

document.addEventListener("DOMContentLoaded", () => {

  const submitButton = document.querySelector("#submitPaymentDetails");

  submitButton.addEventListener("click", async () => {

    const amount = document.querySelector("#amount").value;
    const currency = document.querySelector("#currency").value;


    const fakeUserData = {
      amount: {
        currency: currency,
        value: parseFloat(amount) * 100
      },
      // TODO: figure out how this is diferent to browserInfo, how it is really determined
      channel: "Web"
    };

    console.log(fakeUserData);
    // TODO: frontend data to send to node. maybe unique order number needed - how should I best set this up for Adyen to flicklog through different options e.g. a bad data request with wrong currency for payment method

    // Make request to merchant server which forwards request to Adyen gateway
    try {

      const response = await axios.post(MERCHANT_API_PAYMENT_METHODS_URL, { fakeUserData });

      // Use response to build checkout UI
      // TODO: check for error response from Express server,
      // since we're now just forwarding on directly back
      // here any Adyen gateway errors
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
        // TODO: report error to UI
        console.dir(err);
      }

    } //onSubmit handler
  }; //return

}; // createConfig()
