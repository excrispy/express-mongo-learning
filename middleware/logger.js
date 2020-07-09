function logger(req, res, next) {
  console.log('hi again');
  next();
}

module.exports = logger;
