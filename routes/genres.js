var express = require('express');
var router = express.Router();
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
// express-async-errors is replacement for asyncMiddleware

// router.get('/', asyncMiddleware(async (req, res, next) => {
//   // if we want to do promise error handling without middleware
//   // it would need its own try catch block
//   // try {
//   //   const genres = await Genre.find();
//   //   res.send(genres);
//   // } catch(e) {
//   //   next();
//   // }

//   const genres = await Genre.find();
//   res.send(genres);
// }));

router.get('/', async (req, res, next) => {
  // throw new Error('Could not get genres');

  // requiring the express-async-errors module will take care
  // of async error handling for all route handlers
  const genres = await Genre.find();
  console.log('genres', genres);
  res.send(genres);
});


router.get('/:id', async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  res.send(genre);
});

router.put('/:id', async (req, res, next) => {
  const result = await Genre.update({ _id: req.params.id }, {
    $set: {
      name: req.body.name,
    },
  }, { new: true });

  res.send(result);
});

router.post('/', auth, async (req, res, next) => {
  const genre = new Genre({
    name: req.body.name,
  });

  try {
    await genre.save();
    res.send(genre)
  } catch (e) {
    console.log(e.message);
  }
});

router.delete('/:id', [auth, admin], async (req, res, next) => {
  const result = await Genre.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
