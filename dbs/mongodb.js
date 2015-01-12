var _ = require('underscore');
var mongoose = require('mongoose');
var pkg = require('../package');
var defaults = require('../configs');

exports.connect = connect;
exports.Schema = mongoose.Schema;
exports.isMongodbUri = isMongodbUri;
exports.parseMongodbUri = parseMongodbUri;

function connect(db) {
  // if database is a `mongodb://` URI, init by this URI.
  if (exports.isMongodbUri(db)) 
    return mongoose.createConnection(db);

  var database = _.isObject(db) ? db : {};
  var host = database.host || 'localhost';
  var dbname = database.name || pkg.name;
  var options = database.options || {};
  var port = _.isNumber(database.port) ? parseInt(database.port, 10) : 27017;

  return mongoose.createConnection(host, dbname, port, options);
}

function parseName(dbstr) {
  if (!dbstr) 
    return defaults.database.name;

  var params = dbstr.split('/');

  // check if last param is '' cause '/' is the last letter.
  var dburi = params[params.length - 1] ? 
  params[params.length - 1] : params[params.length - 2];

  // escape from '?'
  var questionDevider = dburi.indexOf('?');

  if (questionDevider === -1) 
    return dburi;

  return dburi.substr(0, questionDevider);
}

function parseMongodbUri(str) {
  return {
    name: parseName(str),
    type: 'mongodb'
  };
}

function isMongodbUri(str) {
  return str && _.isString(str) && str.indexOf('mongodb://') === 0;
}
