require("dotenv").config();
const paypal = require("@paypal/checkout-server-sdk");

const Environment = new paypal.core.LiveEnvironment();
const client = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
const render = (req, res) => {
  res.render("index", {
    paypalClientId: process.env.PAYPAL_CLIENT_ID
  });
};

const payment = async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  const total = req.body.cart.reduce((sum, item) => sum + (item.amount * item.price));
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "EUR",
          value: total,
          breakdown: {
            currency_code: "EUR",
            value: total
          }
        },
        items: req.body.cart.map((item) => item.activity)
      }
    ]
  });
  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Call API with your client and get a response for your call
// const createOrder = async function () {
//   const response = await client.execute(request);
//   console.log(`Response: ${JSON.stringify(response)}`);

// If call returns body in response, you can get the deserialized version from
// the result attribute of the response.
//   console.log(`Order: ${JSON.stringify(response.result)}`);
// };
// createOrder();
module.exports = {
  render,
  payment
};
