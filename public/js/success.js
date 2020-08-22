// console.log('hi! redirect back page');
// //
// const afterRedirectBack = async () => {
//   console.log('inside afterRedirectBack');
//   debugger
//
//   let response = null;
//
//   try {
//     response = await axios.post('/api/handleShopperRedirect');
//
//   } catch(err) {
//     console.log("error:", err);
//   }
//
//
//
//
//   const configuration = createConfig(response.data, CLIENT_KEY);
//   const checkout = new AdyenCheckout(configuration);
//   const dropin = checkout.create('dropin').mount('#dropin-container');
//
//   handlePaymentGatewayResponse( dropin, paymentResponse.data );
//
// };
// // //
// // //
// // const createConfig = (paymentMethods, clientKey) => {
// //
// //   return {
// //     paymentMethodsResponse: paymentMethods, // The `/paymentMethods` response from the server.
// //     clientKey: clientKey, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
// //     locale: "en-US",
// //     environment: "test",
// //     onSubmit: async (state, dropin) => {
// //       try {
// //         const paymentResponse = await axios.post('/api/create_payment', {
// //           paymentMethod: state.data.paymentMethod,
// //           browserInfo: state.data.browserInfo
// //         });
// //
// //
// // // this needs to start over if the redirect returns an action again
// //         if (paymentResponse.data.action) {
// //             dropin.handleAction(paymentResponse.data.action);
// //         } else {
// //           handlePaymentGatewayResponse( dropin, paymentResponse.data );
// //         }; //if response includes action
// //       } catch(err) {
// //         console.log(err);
// //       };
// //     } //onSubmit
// //   }; //return
// // }; // getConfig()
// // //
// const handlePaymentGatewayResponse = (dropin, response) => {
//   // debugger
//   dropin.setStatus(response.status, response.message);
// };
// // //
// // //
// document.addEventListener("DOMContentLoaded", afterRedirectBack);
