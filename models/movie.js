const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  // genre: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Genre',
  // },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    minLength: 0,
    maxLength: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    minLength: 0,
    maxLength: 255,
  },
}));

module.exports = Movie;
