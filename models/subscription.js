const mongoose = require("mongoose");

const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  data: [],
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
