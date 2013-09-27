var model = require('../model/index');

var Ctrler = function(type) {
    this.type = (type && model[type]) ? type : null;
}

// create model instance
Ctrler.prototype.create = function(baby, cb) {
    if (this.type) {
        var baby = new model[this.type](baby);
        baby.save(function(err) {
            cb(err, baby);
        });
    }
}

// remove by ObjectID
Ctrler.prototype.remove = function(id, cb) {
    if (this.type) {
        model[this.type].findByIdAndRemove(id, function(err) {
            cb(err, id);
        });
    }
}

// update by ObjectID
Ctrler.prototype.update = function(id, baby, cb) {
    if (this.type) {
        model[this.type].findByIdAndUpdate(id, baby, function(err, result) {
            cb(err, result);
        });
    }
}

// read single data by ObjectID
Ctrler.prototype.read = function(id, cb) {
    if (this.type) {
        model[this.type].findById(id).exec(function(err, body){
            cb(err, body);
        });
    }
}

// list all collection
Ctrler.prototype.list = function(cb) {
    if (this.type) {
        model[this.type].find({}).exec(function(err, body){
            cb(err, body);
        });
    }
}

// advanced find
Ctrler.prototype.find = function(params, cb) {
    if (this.type) {
        model[this.type].find(params).exec(function(err, body){
            cb(err, body);
        });
    }
}

// advanced findOne
Ctrler.prototype.findOne = function(params, cb) {
    if (this.type) {
        model[this.type].findOne(params).exec(function(err, body){
            cb(err, body);
        });
    }
}