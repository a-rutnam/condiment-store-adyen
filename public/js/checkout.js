// console.log('hi!', AdyenCheckout);

const initialiseCheckout = async () => {

  //frontend data to send to node. maybe unique order number needed - how should I best set this up for Adyen to flick through different options e.g. a bad data request with wrong currency for payment method
  let fakeUserData = {
    "amount": {
      "currency": "AUD",
      "value": 1000
    },
    "channel": "Web"
  }

  let response = null;

  // Make request to node > axios > adyen to get payments methods from Adyen gateway
  try {
    response = await axios.post('/api/payment_methods', { fakeUserData });
  } catch(err) {
    console.log("error:", err);
  }

  // Create config object using payment methods response and client key
  const configuration = createConfig(response.data, CLIENT_KEY, fakeUserData);

  const checkout = new AdyenCheckout(configuration);
  const dropin = checkout.create('dropin').mount('#dropin-container');
};


const createConfig = (paymentMethods, clientKey) => {

  return {
    paymentMethodsResponse: paymentMethods, // The `/paymentMethods` response from the server.
    clientKey: clientKey, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
    locale: "en-US",
    environment: "test",
    onSubmit: async (state, dropin) => {
      const paymentResponse = await axios.post('/api/create_payment', {
        paymentMethod: state.data.paymentMethod,
        browserInfo: state.data.browserInfo
      });

      if (paymentResponse.data.action) {
        dropin.handleAction(paymentResponse.data.action);
      } else {
        handlePaymentGatewayResponse( dropin, paymentResponse.data );
      }; //if response includes action
    } //onSubmit
  }; //return
}; // getConfig()

const handlePaymentGatewayResponse = (dropin, response) => {

  dropin.setStatus(...response)
};


document.addEventListener("DOMContentLoaded", initialiseCheckout);
