const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

router.get('/', async (req, res) => {
  const deliveries = await Delivery.find();
  res.json(deliveries);
});

module.exports = router;