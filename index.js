require('dotenv').config()
const api = require('./lib/adyen_api');
const express = require('express');
const app = express();
const port = 5000;
const handlebars = require('express-handlebars');
const axios = require('axios');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
var Datastore = require('nedb');
var Order = new Datastore({ filename: 'orders.db', autoload: true });
var crypto = require("crypto");
let order_id = null;
const cookieParser = require("cookie-parser");
app.use(cookieParser());


console.log("/////////////////////////////////////////////////Restart");

// Order.find({}, function (err, rows) {
//   console.log( rows );
// });
//
// var order = {
//     order_id: null,
//     status: 'PENDING'
// };

// Order.insert(order, function(err, doc) {
//     console.log('Inserted', doc.status, 'with ID', doc._id);
// });

// //instead of app.set('view engine', 'handlebars');
app.set('view engine', 'hbs');
//instead of app.engine('handlebars', handlebars({
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'main',
  //new configuration parameter
  partialsDir: __dirname + '/views/partials/',
  helpers: require("./util/helpers")
}));

app.use(express.static('public'))

app.listen(port, () => console.log(`App listening to port ${port}`));




let fakeUserData = null;


// render main checkout page with available payment methods
app.get('/checkout', (req, res) => {
  // console.log("index.js, GET /checkout");
  // console.log("req.body", req.body);
  // console.log("----------------------------------------");

  res.render('checkout', {
    CLIENT_KEY: process.env.CLIENT_KEY
    // CLIENT_KEY: process.env.CLIENT_KEY,
    // purchaseData: req.body
  });
});

// get available payment methods from Adyen
// this is the first time we get the fakeUserData in the req object:
app.post('/api/payment_methods', async (req, res) => {
  // console.log("index.js, POST /api/payment_methods");
  // console.log("req.body:", req.body);
  // console.log("----------------------------------------");

  // data sent from front end regarding purchase
  fakeUserData = req.body.fakeUserData;

  let order = {
    "currency": fakeUserData.amount.currency,
    "value": fakeUserData.amount.value,
    "channel": fakeUserData.channel
  };

  Order.insert(order, async function(err, doc) {
    order_id = doc._id;
    try {
      const paymentMethodsResponse = await api.getPaymentMethods( fakeUserData );
      res.json( paymentMethodsResponse.data );
    } catch(err) {
      console.log("error:", err);
    }

// there iss notthing worth databasing in the response data, so I think update should go in checkout method
//     Order.update({_id: order_id}, { $set: { channel: 'solar system' } }, { multi: true }, function (err, numReplaced) {
//   console.log("error:", err);
//   console.log("numReplaced:", numReplaced);
//   console.log("order_id at time of update:", order_id);
// });


  }); // end of Insert

}); // end of app.get('/')


// make a payment
app.post('/api/create_payment', async (req, res) => {
  // console.log("index.js, POST /api/create_payment");
  // console.log("req.body:", req.body);
  // console.log("----------------------------------------");
  const gatewayRequest = {
    method: 'POST',
    url: 'https://checkout-test.adyen.com/v53/payments',
    data: {
      "amount": {
        "currency": fakeUserData.amount.currency,
        "value": fakeUserData.amount.value
      },
      "reference":"YOUR_ORDER_NUMBER",
      "paymentMethod": req.body.paymentMethod,
      "returnUrl":"http://localhost:5000/handleShopperRedirect",
      "merchantAccount":"AdyenRecruitmentCOM",
      "channel": "Web",
      "additionalData":{
        "allow3DS2":true
       },
       "browserInfo": req.body.browserInfo
    },
    headers: {
      "X-API-Key": process.env.API_KEY,
      "Content-type": "application/json"
    },
  };

  try {
    const createPaymentResponse = await api.createPayment( gatewayRequest );

    if (createPaymentResponse.data.action) {

      res.cookie("paymentData", createPaymentResponse.data.action.paymentData);
      res.json({ action: createPaymentResponse.data.action });

    } else {

      let resultCode = createPaymentResponse.data.resultCode;

      const dropinResponse = mapResultCodeToDropinMessage( resultCode );

      res.json( dropinResponse );
    };     //if there is an action
  } catch(err) {
// thiss is running everytime and throwing ""Cannot set headers after they are sent to the client"" error
    // res.status(500).send(err.response.data.message)

    console.log("create payment error:", err);
  }
}); // GET /api/create_payment

const mapResultCodeToDropinMessage = function( response ){
  const map = {
    "Authorised": {
      status: 'success',
      message: 'Payment successful!'
    },
    "Error": {
      status: 'error',
      message: `${response.refusalReason} - More info here https://docs.adyen.com/development-resources/refusal-reasons`
    },
    "Refused": {
      status: 'error',
      message: "Payment was refused. Please try again using a different payment method or card."
    },
    "Pending": {
    // not sure about using the eternal spinner here and for received:
      status: 'loading',
      message: "We've received your order, and are waiting for the payment to be completed."
    },
    "Received": {
      status: 'loading',
      message: "We've received your order, and are waiting for the payment to clear."
    }
  }; //map

  const mappedResponse = map[ response ];
  if( mappedResponse !== undefined){
    return mappedResponse;
  } else {
    // custom response for unknown resultCode value
    return {
      status: 'error',
      message: "Please contact the condiments team."
    };
  }

}; // mapResultCodeToDropinMessage()

// this is the returnUrl that we give to
// redirecting actions like POLI
app.all("/handleShopperRedirect", async (req, res) => {

  if( req.method === 'POST'){
    reqStuff = req.body
  } else {
    reqStuff = req.query
  }

  let payload = {};
  payload["details"] = {payload: reqStuff.payload}; //docs indicate this is deprecated
  payload["paymentData"] = req.cookies["paymentData"];
  payload["url"] = "https://checkout-test.adyen.com/v53/payments/details"
  payload["method"] = "POST"
  payload["headers"] = {
    "X-API-Key": process.env.API_KEY,
    "Content-type": "application/json"
  }

  try {
    let response = await api.createRedirectPayment( payload, reqStuff );

    console.log("redirectPaymentResponse:", response);

    res.redirect(`/final-status?${response.data.resultCode}`);

  } catch (e) {
    console.log('ERROR with redirectPaymentResponse');
    console.dir(e);
    res.json( e );
  }

});

app.get("/final-status", (req, res) => {
  res.render('final-status')
});



// condimentsFakeAPI = () => {
//   return [
//     {
//       name: 'Sambal Terasi',
//       brand: 'ABC',
//       price: 500,
//       product_id: 09032,
//       currency: "AUD"
//     },
//     {
//       name: 'Mushroom XO',
//       brand: 'Baishanzu',
//       price: 200,
//       product_id: 12341,
//       currency: "NL"
//     },
//     {
//       name: 'XXXtra Hot Chile Habanero',
//       brand: 'El Yucateco',
//       price: 12,
//       product_id: 6856,
//       currency: "AUD"
//     },
//     {
//       name: 'Katta Sambol',
//       brand: 'MD',
//       price: 90,
//       product_id: 090342,
//       currency: "AUD"
//     },
//     {
//       name: 'Chilli Jam',
//       brand: 'Suraya',
//       price: 19,
//       product_id: 7452,
//       currency: "AUD"
//     },
//     {
//       name: 'Eros Pista',
//       brand: 'Univer',
//       price: 60,
//       product_id: 3221,
//       currency: "AUD"
//     },
//   ];
// }
// // shop with condiments:
// app.get('/shop', (req, res) => {
//   console.log("Index.js GET /shop");
//   res.render('shop', {
//     condiments: condimentsFakeAPI(),
//     listExists: true
//   });
// });
//
// let purchaseData = null;

// app.post('/purchaseData', (req, res) => {
//   purchaseData = {
//     product_id: req.body.product_id,
//     price: req.body.price,
//     currency: req.body.currency
//   }
//
//   // res.render('shop', {
//   //   condiments: condimentsFakeAPI(),
//   //   listExists: true
//   // });
// });
