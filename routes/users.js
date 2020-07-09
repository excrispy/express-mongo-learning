var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const config = require('config');
const auth = require('../middleware/auth');
const User = require('../models/user');

router.get('/', async (req, res, next) => {
  const user = await User.find();
  res.send(user);
});

// router.get('/:id') // this is not safe cause anyone can find any user
router.get('/me', auth, async (req, res, next) => {
  // comes from your jwt so you get your id
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.put('/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send('User not found');
  }

  if (req.body.name) {
    user.name = req.body.name;
  }
  if (req.body.email) {
    user.name = req.body.email;
  }

  res.send(user);
});

router.post('/', async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send('User with that email already exists!');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
    isAdmin: req.body.isAdmin,
  });

  try {
    await user.save();
    const responseUser = new User({
      _id: req.body.id,
      name: req.body.name,
      password: hashed,
      isAdmin: req.body.isAdmin,
    });
    // res.send(responseUser);
    
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    const token = user.generateAuthToken();
    // still sending user back, but the token is sent back in the header
    res.header('x-auth-token', token).send(responseUser);
  } catch (e) {
    console.log(e.message);
  }
});

router.delete('/:id', async (req, res, next) => {
  const result = await User.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
