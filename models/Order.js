const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  useremail: {
    type: String,
    required: true,
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Order = new mongoose.model("Order", orderSchema);
module.exports = Order;
