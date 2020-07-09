const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlegth: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function() {
  // set private key via env var in cli by
  // export app_jwtPrivateKey=keyName
  // where app_jwtPrivateKey is defined in the custom-environment-variable
  // json config file
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));

  return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
