var express = require('express');
var router = express.Router();
const Movie = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res, next) => {
  // const movie = await Movie.find().populate('genre');
  const movies = await Movie.find().sort('title');
  console.log(movies);
  res.send(movies);
});

router.get('/:id', async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  res.send(movie);
});

router.put('/:id', async (req, res, next) => {
  const result = await Movie.update({ _id: req.params.id }, {
    $set: {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
  }, { new: true });

  res.send(result);
});

router.post('/', async (req, res, next) => {
  const genre = await Genre.findById(req.body.genre);
  const movie = new Movie({
    title: req.body.title,
    // genre: req.body.genre,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    await movie.save();
    res.send(movie)
  } catch (e) {
    console.log(e.message);
  }
});

router.delete('/:id', async (req, res, next) => {
  const result = await Movie.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
