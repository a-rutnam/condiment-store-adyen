require('dotenv').config()
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




// shop with condiments:
app.get('/shop', (req, res) => {
  res.render('shop', {
    condiments: condimentsFakeAPI(),
    listExists: true
  });
});

condimentsFakeAPI = () => {
  return [
    {
      name: 'Sambal Terasi',
      brand: 'ABC',
      price: 500
    },
    {
      name: 'Mushroom XO',
      brand: 'Baishanzu',
      price: 200
    },
    {
      name: 'XXXtra Hot Chile Habanero',
      brand: 'El Yucateco',
      price: 12
    },
    {
      name: 'Katta Sambol',
      brand: 'MD',
      price: 90
    },
    {
      name: 'Chilli Jam',
      brand: 'Suraya',
      price: 19
    },
    {
      name: 'Eros Pista',
      brand: 'Univer',
      price: 60
    },
  ];
}

// return available payment methods based on data sent from frontend
let fakeUserData = null;

app.post('/api/payment_methods', async (req, res) => {

  // data sent from front end - need to store this in my db, i think
  fakeUserData = req.body.fakeUserData

  let response = null;
  try {
    response = await axios({
      method: 'POST',
      url: 'https://checkout-test.adyen.com/v53/paymentMethods',
      data: {
        "merchantAccount": "AdyenRecruitmentCOM",
        "countryCode": "AU",
        "amount": {
          "currency": fakeUserData.amount.currency,
          "value": fakeUserData.amount.value
        },
        "channel": fakeUserData.channel,
        "shopperLocale": "en-US"
      },
      headers: {
        "X-API-Key": process.env.API_KEY,
        "Content-type": "application/json"
      },
    })
  } catch(err) {
    console.log("error:", err);
  }

 res.json( response.data );
}); // end of app.get('/')

// render main checkout page with available payment methods
app.get('/checkout', (req, res) => {

  res.render('checkout', {
    CLIENT_KEY: process.env.CLIENT_KEY
  });

});

// make a payment
app.post('/api/create_payment', async (req, res) => {

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
      "returnUrl":"http://localhost:5000/checkout",
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

  let response = null;
  try {
     response = await axios( gatewayRequest);
  } catch(err) {
    console.log("error:", err);
  }

// breakout what is actually needed here to be sent to frontend
    res.json(response.data);
});
