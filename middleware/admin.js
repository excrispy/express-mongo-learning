function admin(req, res, next) {
  // 401 unauthorized
  if (!req.user.isAdmin) {
    return res.status(403).send('Access denied'); // forbidden
  }

  next();
}

module.exports = admin;
