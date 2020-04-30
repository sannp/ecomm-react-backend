const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  _ID: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema, "cart");

module.exports = Cart;
