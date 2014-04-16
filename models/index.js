var fs = require('fsplus');
var path = require('path');
var mongoose = require('mongoose');
var database = fs.readJSON('../configs/db');
console.log(database);
var host = database.host || 'localhost';
var dbname = database.name || 'test';
var opts = database.options || {};
var port = (database.port && !isNaN(parseInt(database.port, 10))) ? parseInt(database.port, 10) : 27017;

exports.Schema = mongoose.Schema;
exports.db = mongoose.createConnection(host, dbname, port, opts);