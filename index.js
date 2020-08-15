require('dotenv').config()
const express = require('express');
const app = express();
const port = 5000;
const handlebars = require('express-handlebars');
const axios = require('axios');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


// //instead of app.set('view engine', 'handlebars');
app.set('view engine', 'hbs');
//instead of app.engine('handlebars', handlebars({
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'planB',
  //new configuration parameter
  partialsDir: __dirname + '/views/partials/',
  helpers: require("./util/helpers")
}));

app.use(express.static('public'))

app.listen(port, () => console.log(`App listening to port ${port}`));

// Main checkout page
app.get('/checkout', (req, res) => {
  res.render('main', {layout: 'index', CLIENT_KEY: process.env.CLIENT_KEY,  listExists: true});
});

// MAIN TEST ROUTE
app.get('/api/payment_methods', async (req, res) => {
  const response = await axios({
    method: 'POST',
    url: 'https://checkout-test.adyen.com/v53/paymentMethods',
    data: {
      "merchantAccount": "AdyenRecruitmentCOM",
      "countryCode": "NL",
      "amount": {
        "currency": "EUR",
        "value": 1000
      },
      "channel": "Web",
      "shopperLocale": "nl-NL"
    },
    headers: {
      "X-API-Key": process.env.API_KEY,
      "Content-type": "application/json"
    },
  });
  // console.log(response.data);
  // if( 'debug' in req.query ){
  //   res.json( response.data );
  // } else {
  //   res.render('main', {layout: 'index', condiments: 'NOTHING YET',  listExists: true});
  // }

 res.json( response.data );
}); // end of app.get('/')

app.post('/api/create_payment', async (req, res) => {

  // try {
    const response = await axios({
      method: 'POST',
      url: 'https://checkout-test.adyen.com/v53/payments',
      data: {
        "amount":{
          "currency":"EUR",
          "value":1000
        },
        "reference":"YOUR_ORDER_NUMBER",
        "paymentMethod": req.body.paymentMethod,
        "returnUrl":"https://example.com/checkout?shopperOrder=12xy..",
        "merchantAccount":"AdyenRecruitmentCOM"
      },
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      },
    });
  // } catch(err) {
  //   // console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
  //   console.log(err);
  //   // ask luke what that error object is, how to orrectly access messafe
  //   //     res.status(err.statusCode).json(err.message);
  // }
  console.log("response", response);

});
// const configuration = {
//  paymentMethodsResponse: response.data.paymentMethods // The `/paymentMethods` response from the server.
//  clientKey: process.env.CLIENT_KEY, // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
//  locale: "en-US",
//  environment: "test",
//  onSubmit: (state, dropin) => {
//      // Your function calling your server to make the `/payments` request
//      makePayment(state.data)
//        .then(response => {
//          if (response.action) {
//            // Drop-in handles the action object from the /payments response
//            dropin.handleAction(response.action);
//          } else {
//            // Your function to show the final result to the shopper
//            showFinalResult(response);
//          }
//        })
//        .catch(error => {
//          throw Error(error);
//        });
//    },
//  onAdditionalDetails: (state, dropin) => {
//    // Your function calling your server to make a `/payments/details` request
//    makeDetailsCall(state.data)
//      .then(response => {
//        if (response.action) {
//          // Drop-in handles the action object from the /payments response
//          dropin.handleAction(response.action);
//        } else {
//          // Your function to show the final result to the shopper
//          showFinalResult(response);
//        }
//      })
//      .catch(error => {
//        throw Error(error);
//      });
//  },
//  paymentMethodsConfiguration: {
//    card: { // Example optional configuration for Cards
//      hasHolderName: true,
//      holderNameRequired: true,
//      enableStoreDetails: true,
//      hideCVC: false, // Change this to true to hide the CVC field for stored cards
//      name: 'Credit or debit card'
//    }
//  }
// };
//
// const checkout = new AdyenCheckout(configuration);
// const dropin = checkout.create('dropin').mount('#dropin-container');


// i think the await should be taking care of it. show luke the object promise render, i might just be sending the wrong thing
//The following works, don't delete til you've figured out the different try/catch format
// async function makePostRequest() {
//   const response = await axios({
//     method: 'POST',
//     url: 'https://checkout-test.adyen.com/v53/paymentMethods',
//     data: {
//       "merchantAccount": "AdyenRecruitmentCOM",
//       "countryCode": "NL",
//       "amount": {
//         "currency": "EUR",
//         "value": 1000
//       },
//       "channel": "Web",
//       "shopperLocale": "nl-NL"
//     },
//     headers: {
//       "X-API-Key": process.env.API_KEY,
//       "Content-type": "application/json"
//     },
//   });
//
//   response.data.paymentMethods.forEach(item => console.log('item', item));
//   // console.log(response.data.groups);
//
//   return response.data
// }
//
//
//
  // makePostRequest();

  // response.data.paymentMethods.forEach(item => console.log('item', item));
  // console.log(response.data.groups);



// Working with static data:
// app.get('/', (req, res) => {
//   res.render('main', {layout: 'index', condiments: working(),  listExists: true});
// });
//
//
// working = () => {
//   return [
//     {
//       name: 'Sambal Terasi',
//       brand: 'ABC',
//       price: 500
//     },
//     {
//       name: 'Mushroom XO',
//       brand: 'Baishanzu',
//       price: 200
//     },
//     {
//       name: 'XXXtra Hot Chile Habanero',
//       brand: 'El Yucateco',
//       price: 12
//     },
//     {
//       name: 'Katta Sambol',
//       brand: 'MD',
//       price: 90
//     },
//     {
//       name: 'Chilli Jam',
//       brand: 'Suraya',
//       price: 19
//     },
//     {
//       name: 'Eros Pista',
//       brand: 'Univer',
//       price: 60
//     },
//   ];
// }

// app.get("/api/getPaymentMethods", async (req, res) => {
//   try {
//     const response = await checkout.paymentMethods({
//       channel: "Web",
//       merchantAccount: process.env.MERCHANT_ACCOUNT
//     });
//     res.json(response);
//   } catch (err) {
//     console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
//     res.status(err.statusCode).json(err.message);
//   }
// });
