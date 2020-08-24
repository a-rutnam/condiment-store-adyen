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

// GET /checkout: render main checkout page
app.get('/checkout', (req, res) => {
  // Pull CLIENT_KEY from .env file and forward to frontend (avoid GitHub publishing)
  res.render('checkout', { CLIENT_KEY: process.env.CLIENT_KEY });

});

// GET /admin: order reporting/logs
app.get('/admin', (req, res) => {
  Order.find({}, (err, orders) => {
    console.log({orders});
    res.render('admin', {orders: orders});
  })
}); // app.get('/admin')


// API routes /////////////////////////////////////////////////////////////////

// POST /api/payment_methods: retrieve available payment methods from Adyen
app.post('/api/payment_methods', async (req, res) => {

  // For use in DB update in 'finally':
  let paymentMethodsResponse = {}, orderStatus = '',  resultCode = '';

  try {

    paymentMethodsResponse = await api.getPaymentMethods( req.body.fakeUserData );
    // creating a copy of customer's process in merchant's database
    orderStatus = 'PAYMENT_METHODS_RECEIVED_SUCCESS';

  } catch(e) {

    orderStatus = 'PAYMENT_METHODS_RECEIVED_FAILURE';

    // Store error into response for DB in 'finally'
    paymentMethodsResponse.data = e.response.data;
    res.json(e.response.data)
  } finally {

    const orderDoc = {
      status: orderStatus,
      user_id: 12345, // Fake placeholder

      // Also use the order document to store all the
      // Adyen request & response data, for auditing/logging
      adyenData: {
        paymentMethods: {
          // Axios gives us original request body in config.data,
          // but we want to save to DB as an actual JS object,
          // hence the JSON.parse:
          request: JSON.parse(paymentMethodsResponse.config.data),
          response: paymentMethodsResponse.data
        },
        createPayment: {
          request: {},
          response: {}
        },
        resultCode: ''
      }
    };

    Order.insert(orderDoc, (err, doc) => {
      // On successful save of new Order record, set cookie
      // and forward JSON response to frontend AJAX
      res.cookie("order_id", doc._id); // For future DB updates
      res.json( paymentMethodsResponse.data );
    }); // Order.insert
  } // finally
}); // app.post('/api/payment_methods')


// POST /api/create_payment: make a payment
app.post('/api/create_payment', async (req, res) => {

  // For use in DB update in 'finally':
  let createPaymentResponse = {config: {data: null}},
    orderStatus = '',
    resultCode = '';

  try {

    createPaymentResponse = await api.createPayment( req.body );

    // TODO: remove this conditional if possible, as it also exists on the front end
    if (createPaymentResponse.data.action) {
      res.cookie("payment_data", createPaymentResponse.data.action.paymentData);
      orderStatus = 'CREATE_PAYMENT_ACTION_RECEIVED';
      resultCode = createPaymentResponse.data.response
      res.json({ action: createPaymentResponse.data.action });

    } else {

      resultCode = createPaymentResponse.data.resultCode;
      orderStatus = 'CREATE_PAYMENT_ADYEN_STATUS_RECEIVED';
      let dropinResponse = mapResultCodeToDropinMessage( resultCode );
      res.json( dropinResponse );
    }

  } catch(e) {
    orderStatus = 'CREATE_PAYMENT_RECEIVED_FAILURE';
    createPaymentResponse.data = e.response.data; // for DB update - we don't one to send details of failure to client
    return res.status(422).json({});

  } finally {


    Order.update(
      {_id: req.cookies.order_id},
      { $set: {
        status: orderStatus,
        'adyenData.createPayment.request': JSON.parse(createPaymentResponse.config.data),
        'adyenData.createPayment.response': createPaymentResponse.data,
        'adyenData.resultCode': resultCode
      }},
      {multi: false}
    ); // Order.update
  } // finally
}); // GET /api/create_payment

const mapResultCodeToDropinMessage = ( response ) => {
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


  let orderID = req.cookies.order_id;
  let paymentData = req.cookies.payment_data;
  // TODO: rename this
  // if there is non-POST request
  const reqStuff = (req.method === 'POST') ? req.body : req.query;

  const payload = {
    details: { payload: reqStuff.payload },
    paymentData: paymentData,
    url: "https://checkout-test.adyen.com/v53/payments/details",
    method: "POST",
    headers: {
      "X-API-Key": process.env.API_KEY,
      "Content-type": "application/json"
    }
  };

  try {
    let response = await api.createRedirectPayment( payload );


    // if (response.data.action) {

      // Following is not in use: At this point I need to send action data back to the frontend for the dropin to handle but the AdyenCheckout instance requires the full configuration object to be recreated. My question is it better practice to re-pull that data from my database, or from cookies?
      // res.redirect('/submitAdditionalDetails');

    // } else {

      resultCode = response.data.resultCode;
      orderStatus = 'CREATE_PAYMENT_ADYEN_STATUS_RECEIVED';
      const dropinResponse = mapResultCodeToDropinMessage( resultCode );

      Order.update(
        {_id: orderID},
        { $set: {
          'adyenData.createPayment.request': JSON.parse(response.config.data),
          'adyenData.createPayment.response': response.data,
          'adyenData.resultCode': resultCode
        }},
        {multi: false}
      ); // Order.update

      res.clearCookie("payment_data");
      res.clearCookie("order_id");
      res.json( dropinResponse );



  } catch (e) {
    res.json( e.code );
    return;
  }

}); // app.all("/handleShopperRedirect")

// not in use
// app.post("/submitAdditionalDetails", (req, res) => {
//   // // Create the payload for submitting payment details
//   // let payload = {};
//   // payload["details"] = req.body.details;
//   // payload["paymentData"] = req.body.paymentData;
//   // // Return the response back to client
//   // // (for further action handling or presenting result to shopper)
//   // checkout.paymentsDetails(payload).then(response => {
//   //   let resultCode = response.resultCode;
//   //   let action = response.action || null;
//   //   res.json({ action, resultCode });
//   // });
// });
