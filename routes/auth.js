var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
// var jwt = require('jsonwebtoken');
// var config = require('config');
var User = require('../models/user');

router.post('/', async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send('Invalid email or password!');
    return;
  }

  // bcrypt takes salt from user pw and rehashes the pw on the POST
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid email or password!');
  }

  // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  const token = user.generateAuthToken();

  res.send(token);
});

module.exports = router;
