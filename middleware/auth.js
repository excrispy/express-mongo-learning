const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(400).send('Access denied. No token provided.');
  }

  try {
    // jwt.verify returns the decoded body of the token
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch(e) {
    res.status(400).send('Invalid token');
  }
}

module.exports = auth;
