// console.log('hi!', AdyenCheckout);

const createConfig = (paymentMethods, clientKey) => {
  return {
   paymentMethodsResponse: paymentMethods, // The `/paymentMethods` response from the server.
   clientKey: clientKey, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
   locale: "en-US",
   environment: "test",
   onSubmit: (state, dropin) => {
     console.log("state:", state.data.paymentMethod);
     axios.post('/api/create_payment', {
       paymentMethod: state.data.paymentMethod
     });
       // // Your function calling your server to make the `/payments` request
       // makePayment(state.data)
       //   .then(response => {
       //     if (response.action) {
       //       // Drop-in handles the action object from the /payments response
       //       dropin.handleAction(response.action);
       //     } else {
       //       // Your function to show the final result to the shopper
       //       showFinalResult(response);
       //     }
       //   })
       //   .catch(error => {
       //     throw Error(error);
       //   });
     },
   // onAdditionalDetails: (state, dropin) => {
   //   // Your function calling your server to make a `/payments/details` request
   //   makeDetailsCall(state.data)
   //     .then(response => {
   //       if (response.action) {
   //         // Drop-in handles the action object from the /payments response
   //         dropin.handleAction(response.action);
   //       } else {
   //         // Your function to show the final result to the shopper
   //         showFinalResult(response);
   //       }
   //     })
   //     .catch(error => {
   //       throw Error(error);
   //     });
   // },
   // paymentMethodsConfiguration: {
   //   card: { // Example optional configuration for Cards
   //     hasHolderName: true,
   //     holderNameRequired: true,
   //     enableStoreDetails: true,
   //     hideCVC: false, // Change this to true to hide the CVC field for stored cards
   //     name: 'Credit or debit card'
   //   }
   // }
 };
}; // getConfig()


const initialiseCheckout =  async () => {

  // Make request to our own backend API
  // to get payments methods from Adyen gateway
  const response = await axios.get('/api/payment_methods');
  // console.log('payment methods response:', response);

  // Create config object using payment methods response and client key
  const configuration = createConfig(response.data, CLIENT_KEY);

  const checkout = new AdyenCheckout(configuration);
  const dropin = checkout.create('dropin').mount('#dropin-container');

};


document.addEventListener("DOMContentLoaded", initialiseCheckout);
