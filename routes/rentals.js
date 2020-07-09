var express = require('express');
var router = express.Router();
const Rental = require('../models/rental');
const Movie = require('../models/movie');
const Customer = require('../models/customer');

router.get('/', async (req, res, next) => {
  const rental = await Rental.find().sort('-dateOut');
  res.send(rental);
});

router.get('/:id', async (req, res, next) => {
  const rental = await Rental.findById(req.params.id);
  res.send(rental);
});

router.post('/', async (req, res, next) => {
  const movie = await Movie.findById(req.body.movieId);

  if (!movie) {
    return res.status(400).send('Invalid Movie');
  }

  const customer = await Customer.findById(req.body.customerId);

  if (!customer) {
    return res.status(400).send('Invalid Customer');
  }

  if (movie.numberInStock === 0) {
    return res.status(400).send('Movie not available');
  }

  movie.numberInStock--;

  const rental = new Rental({
    customer: {
      _id: req.body.customerId,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: req.body.movieId,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    // can use npm package fawn for two phase commit
    // to make sure both are saved or none are saved to db
    await rental.save();
    await movie.save();
    res.send(rental)
  } catch (e) {
    console.log(e.message);
  }
});

router.delete('/:id', async (req, res, next) => {
  const result = await Rental.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
