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
const cookieParser = require("cookie-parser");
app.use(cookieParser());


console.log("/////////////////////////////////////////////////Restart");

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'main',
  //new configuration parameter
  partialsDir: __dirname + '/views/partials/',
  helpers: require("./util/helpers")
}));

app.use(express.static('public'))

// Start the server listening
app.listen(port, () => console.log(`App listening to port ${port}`));

// PAYMENT PROCESS BEGINS HERE:
//
// GET /checkout: render main checkout page
app.get('/checkout', (req, res) => {
  // Pull CLIENT_KEY from .env file and forward to frontend (avoid GitHub publishing)
  res.render('checkout', { CLIENT_KEY: process.env.CLIENT_KEY });
});


// API routes /////////////////////////////////////////////////////////////////

// POST /api/payment_methods: retrieve available payment methods from Adyen
app.post('/api/payment_methods', async (req, res) => {

  // data sent from frontend regarding purchase
  const fakeUserData = req.body.fakeUserData;

  // TODO: Store in the same format as it's received
  let order = {
    "currency": fakeUserData.amount.currency,
    "value": fakeUserData.amount.value,
    "channel": fakeUserData.channel
  };

  Order.insert(order, async function(err, doc) {
    // On successful save: set cookie, make Adyen request
    res.cookie("order_id", doc._id); // For future DB updates
    try {
      const paymentMethodsResponse = await api.getPaymentMethods( fakeUserData );
      res.json( paymentMethodsResponse.data );
    } catch(e) {
      // TODO: error reporting in console, save to DB?
      res.json( e );
    }

    // just keep for syntax:
    // Order.update({_id: order_id}, { $set: { channel: 'solar system' } }, { multi: false }, function (err, numReplaced) {});

  }); // Order.insert success callback

}); // app.post('/api/payment_methods')


// POST /api/create_payment: make a payment
app.post('/api/create_payment', async (req, res) => {
  const gatewayRequest = {
    method: 'POST',
    // TODO: extract base URL to config constant
    url: 'https://checkout-test.adyen.com/v53/payments',
    data: {
      amount: {
        // TODO: remove quotes from keys
        "currency": req.body.amount.currency,
        "value": req.body.amount.value
      },
      "reference":"YOUR_ORDER_NUMBER", //TODO: need to use DB order_id?
      "paymentMethod": req.body.paymentMethod,
      "returnUrl": "http://localhost:5000/handleShopperRedirect", //TODO: config const?
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

    // TODO: remove this conditional if possible
    if (createPaymentResponse.data.action) {

      res.cookie("paymentData", createPaymentResponse.data.action.paymentData);
      res.json({ action: createPaymentResponse.data.action });

    } else {

      let resultCode = createPaymentResponse.data.resultCode;

      const dropinResponse = mapResultCodeToDropinMessage( resultCode );

      res.json( dropinResponse );
    }    //if there is an action

  } catch(e) {
    res.json( e );
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
    // custom response for unknown resultCode value (undefined key)
    return {
      status: 'error',
      message: "Please contact the condiments team."
    };
  }

}; // mapResultCodeToDropinMessage()


// (ALL) /handleShopperRedirect: the returnUrl that we give to POLI
// to redirect browser to, after POLI processing
app.all("/handleShopperRedirect", async (req, res) => {

  // TODO: rename this
  const reqStuff = (req.method === 'POST') ? req.body : req.query;

  // TODO: object literal
  const payload = {
    details: { payload: reqStuff.payload },
    paymentData: req.cookies["paymentData"],
    url: "https://checkout-test.adyen.com/v53/payments/details",
    method: "POST",
    headers: {
      "X-API-Key": process.env.API_KEY,
      "Content-type": "application/json"
    }
  };

  try {
    let response = await api.createRedirectPayment( payload, reqStuff );
    // TODO: anything else to clean up here?
    // ********* Possible action key check & handling?
    res.clearCookie("paymentData");
    res.clearCookie("order_id");
    res.redirect(`/final-status?resultCode=${response.data.resultCode}`);

  } catch (e) {
    // TODO: log and save to db?
    res.json( e );
  }

}); // app.all("/handleShopperRedirect")


// GET /final-status: above route directs here after Adyen query
// TODO: Possibly use res.redirect() switch here as in docs
app.get("/final-status", (req, res) => {
  res.render('final-status');
});
