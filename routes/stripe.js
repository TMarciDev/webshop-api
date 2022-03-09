const router = require("express").Router();
const Subscription = require("../models/subscription");
var express = require("express");
var bodyParser = require("body-parser");

//const stripe = require("stripe")(process.env.STRIPE_KEY);
const Stripe = require("stripe");

router.post("/payment", (req, res) => {
  const stripe = Stripe(process.env.STRIPE_KEY);
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

router.post("/webhook", async (req, res) => {
  const stripe = Stripe;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log("ehhh");
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "charge.succeeded":
      const invoice = event.data.object;

      const newSub = new Subscription({
        data: [JSON.stringify(invoice)],
      });
      try {
        const savedSub = await newSub.save();
        res.status(201).json(savedSub);
      } catch (err) {
        res.status(500).json(err);
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
});

module.exports = router;
