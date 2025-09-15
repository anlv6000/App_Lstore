const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.get('/', async (req, res) => {
  const carts = await Cart.find();
  res.json(carts);
});

module.exports = router;