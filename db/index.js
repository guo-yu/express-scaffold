var pkg = require('../package');
var mongoose = require('mongoose');

exports.connect = function(database) {
  var host = database.host || 'localhost';
  var dbname = database.name || pkg.name;
  var options = database.options || {};
  var port = (database.port && !isNaN(parseInt(database.port))) ? parseInt(database.port) : 27017;
  return mongoose.createConnection(host, dbname, port, options);
}

exports.Schema = mongoose.Schema;