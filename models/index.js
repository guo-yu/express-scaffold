// mongodb model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var database = require('../configs/database.json');
var host = database.host ? database.host : 'localhost';
var dbname = database.name ? database.name : 'test';
var port = (database.port && !isNaN(parseInt(database.port, 10))) ? parseInt(database.port, 10) : 27017;
var opts = database.options ? database.options : {};
var db = mongoose.createConnection(host, dbname, port, opts);

exports.Schema = Schema;
exports.db = db;