var express = require('express');
var router = express.Router();
const Customer = require('../models/customer');

router.get('/', async (req, res, next) => {
  const customer = await Customer.find();
  res.send(customer);
});

router.get('/:id', async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  res.send(customer);
});

router.put('/:id', async (req, res, next) => {
  const result = await Customer.update({ _id: req.params.id }, {
    $set: {
      name: req.body.name,
    },
  }, { new: true });

  res.send(result);
});

router.post('/', async (req, res, next) => {
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
  });

  try {
    await customer.save();
    res.send(customer)
  } catch (e) {
    console.log(e.message);
  }
});

router.delete('/:id', async (req, res, next) => {
  const result = await Customer.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
