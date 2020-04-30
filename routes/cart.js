const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");

// Getting all cart products
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one subscriber
router.post("/add", async (req, res) => {
  const product = new Cart({
    ...req.body,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting one subscriber
router.delete("/remove/:id", getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: "Deleted This Product", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function for getting product by ID
async function getProduct(req, res, next) {
  try {
    prod = await Cart.findById(req.params.id);
    if (prod == null) {
      return res.status(404).json({ message: "Cant find product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = prod;
  next();
}

module.exports = router;
