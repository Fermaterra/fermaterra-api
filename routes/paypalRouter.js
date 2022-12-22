const { Router } = require("express");

const paypalRouter = Router();

const { render, payment } = require("../controllers/paypalController");

paypalRouter.route("/")
  .get(render)
  .post(payment);

module.exports = paypalRouter;
