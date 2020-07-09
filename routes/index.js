const express = require('express');
const router = express.Router();
const courses = require('./courses');
const genres = require('./genres');
const movies = require('./movies');
const customers = require('./customers');
const rentals = require('./rentals');
const users = require('./users');
const auth = require('./auth');
const error = require('../middleware/error');

router.use('/api/courses', courses);
router.use('/api/genres', genres);
router.use('/api/movies', movies);
router.use('/api/customers', customers);
router.use('/api/rentals', rentals);
router.use('/api/users', users);
router.use('/api/auth', auth);
router.use(error);

module.exports = router;
