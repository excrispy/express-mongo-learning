const winston = require('winston'); // logger
require('winston-mongodb'); // logger to mongodb
require('express-async-errors');

module.exports = function() {
  // log logs in specified file
  winston.add(winston.transports.File, { filename: 'logfile.log' });
  // log logs under "log" dir on db in compass
  // metadata property is second property of .error method in error.js
  winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/playground' });
  // error: only logs errors
  // warn
  // info
  // verbose
  // debug
  // sily

  // catches exceptions that arent in a catch block
  // good for errors outside context of express pipeline
  // can log errors outside express using winston this way
  process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  })
  // throw new Error('THIS IS AN ERROR!');

  // equivalent of above
  winston.handleExceptions(
    // console is good for dev
    new winston.transports.Console({ colorize: true, prettyPrint: true}),
    // file is good for prod
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  // catches errors on promises
  process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);

    // this will throw an exception on promise rejection
    // so it is logged in the winston.handleExceptions
    // throw ex;
  });
  // const p = Promise.reject(new Error('Fail'));
  // p.then(() => console.log('Done'));
    // .catch(); // no catch called
}
