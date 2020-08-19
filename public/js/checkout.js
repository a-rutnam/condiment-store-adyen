// console.log('hi!', AdyenCheckout);

const initialiseCheckout = async () => {

  //frontend data to send to node. maybe unique order number needed
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

// move this logic to backend and make less brittle
      if (paymentResponse.data.action) {
        dropin.handleAction(paymentResponse.data.action);
      } else {
        handlePaymentGatewayResponse( dropin, paymentResponse.data );
      }; //if action
    } //onSubmit
  }; //return
}; // getConfig()

const handlePaymentGatewayResponse = (dropin, response) => {
  console.log("handlePaymentGatewayResponse:", response);

  let resultCode = response.resultCode;

  switch (resultCode) {
    case "Authorised":
      dropin.setStatus('success', { message: 'Payment successful!' });
      break;
    case "Error":
      dropin.setStatus('error', { message: `${response.data.refusalReason} - More info here https://docs.adyen.com/development-resources/refusal-reasons`});
      break;
    case "Refused":
      dropin.setStatus('error', { message: "Payment was refused. Please try again using a different payment method or card." });
      break;
    case "Pending":
    // not sure about using the eternal spinner here and for received:
      dropin.setStatus('loading', { message: "We've received your order, and are waiting for the payment to be completed." });
      break;
    case "Received":
      dropin.setStatus('loading', { message: "We've received your order, and are waiting for the payment to clear." });
      break;
    default:
      dropin.setStatus('loading', { message: "Please contact the condiments team." });
      break;
  }; //switch
};


document.addEventListener("DOMContentLoaded", initialiseCheckout);
