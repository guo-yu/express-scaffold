// mongodb model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    database = require('../database.json'),
    host = database.host ? database.host : 'localhost',
    dbname = database.name ? database.name : 'test',
    port = (database.port && !isNaN(parseInt(database.port, 10))) ? parseInt(database.port, 10) : 27017,
    opts = database.options ? database.options : {},
    db = mongoose.createConnection(host, dbname, port, opts);

// userModel
var userModel = new Schema({
    name: String,
    created: Date,
});

exports.user = db.model('user', userModel);