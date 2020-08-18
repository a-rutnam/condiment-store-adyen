// console.log('hi!', AdyenCheckout);

const initialiseCheckout = async () => {

  // Make request to our own backend API to get payments methods from Adyen gateway
  //frontend data to send to node
  let fakeUserData = {
    "amount": {
      "currency": "AUD",
      "value": 1000
    },
    "channel": "Web"
  }

  let response = null;

  try {
    response = await axios.post('/api/payment_methods', { fakeUserData });
  } catch(err) {
    console.log("error:", err);
  }

  // Create config object using payment methods response and client key
  const configuration = createConfig(response.data, CLIENT_KEY);

  const checkout = new AdyenCheckout(configuration);
  const dropin = checkout.create('dropin').mount('#dropin-container');

};


const createConfig = (paymentMethods, clientKey) => {
  // I think that at this stage we would be sending
  // amount Amount to be displayed on the Pay Button. It expects an object with the value and currency properties. For example, { value: 1000, currency: 'USD' }.


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


      // ask Luke: isn't this else brittle? Or, what is the best way to check that payment response has data in it, and isn't null
      console.log("plain data obj:", paymentResponse.data);

      if (paymentResponse.data.action) {
        console.log("fff", paymentResponse.data);
        debugger;
        dropin.handleAction(paymentResponse.data.action);
      } else {
      // Your function to show the final result to the shopper
        console.log("hooray:", paymentResponse.data);
        handlePaymentGatewayResponse( dropin, paymentResponse.data );
      }; //if action
    } //onSubmit
  }; //return
}; // getConfig()

const handlePaymentGatewayResponse = (dropin, response) => {
  console.log("handlePaymentGatewayResponse:", response);
  // dropin.setStatus('success', { message: 'Payment successful!' });

  // dropin.setStatus('loading'); // start the loading state

  let resultCode = response.resultCode;


// use spread to send args to dropin.setStatus

//     switch (resultCode) {
//       case "Authorised":
//         return ['success', { message: 'Payment successful!' }]
//       case "Error":
//       // ideally library would present the docs info here i.e. not supported means "The shopper's bank does not support or does not allow this type of transaction."
//         return ["error", `${response.data.refusalReason} - More info here https://docs.adyen.com/development-resources/refusal-reasons`]
//       case "Pending":
//       // ideally i'd want seller to say we will contact you when payment is completed
//         return "We've received your order, and are waiting for the payment to be completed."
//       case "PresentToShopper":
// //       For a voucher payment method, inform the shopper that you are waiting for their payment. You will receive the final result of the payment in an AUTHORISATION notification.
// //
// // For a qrCode payment method, wait for the AUTHORISATION notification before presenting the payment result to the shopper.
//       case "Refused":
//       // Inform the shopper that the payment was refused. Ask the shopper to try the payment again using a different payment method or card.
//
//       case "Received":
//         return "We've received your order, and are waiting for the payment to clear."
//       default:
//         text = "Please contact the condiments team";
//     }
  // })

// Authorised, Error, Pending, PresentToShopper, Refused, Received

// map to success / error / loading /ready

//pending is eternal spinner, awful

// dropin.setStatus('loading'); // start the loading state

};


document.addEventListener("DOMContentLoaded", initialiseCheckout);
