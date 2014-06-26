var debug = require('debug');
var pkg = require('../package');

module.exports = logger;

function logger(globalName) {
  return function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var global = globalName || pkg.name;
    return debug(
      args.length > 0 ?
      [global, args.join(':')].join(':') :
      global
    )
  }
}