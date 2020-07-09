var config = require('config');

// access config properties
// will search config directory. the file names correspond to the NODE_ENV value
// console.log(config.get('name'));
// console.log('ENV', process.env.NODE_ENV, app.get('env'));
// console.log('password', config.get('mail.password')); // accesses custom-environment-variables.
// the value of the key is set in the environment via cli: export app_password=1234

module.exports = function() {
  if (!config.get('jwtPrivateKey')) {
    // console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    // process.exit(1); // 0 === success, anything else is failure

    // can throw error if we have the uncaught exception
    // and unhandled rejection listeners
    // otherwise, the above code works
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}
