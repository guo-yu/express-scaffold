var _ = require('underscore');
var mongoose = require('mongoose');
var pkg = require('../package');

exports.Schema = mongoose.Schema;

exports.connect = function(db) {
  // if database is a mongodb:// URI, init by this URI.
  if (isMongodbUri(db)) return mongoose.createConnection(db);
  var database = _.isObject(db) ? db : {};
  var host = database.host || 'localhost';
  var dbname = database.name || pkg.name;
  var options = database.options || {};
  var port = (database.port && !isNaN(parseInt(database.port))) ? parseInt(database.port) : 27017;
  return mongoose.createConnection(host, dbname, port, options);
}

function isMongodbUri(str) {
  return str && _.isString(str) && str.indexOf('mongodb://') === 0;
}