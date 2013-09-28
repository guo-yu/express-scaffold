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

// list by page
Ctrler.prototype.page = function(page, limit, params, cb) {
    var self = this,
        from = (page && page > 1) ? ((page - 1) * limit) : 0;
    if (self.type) {
        model[self.type].count(params).exec(function(err, count) {
            if (!err) {
                model[self.type].find(params).skip(from).limit(limit).exec(function(err,results){
                    cb(err, results, {
                        limit: limit,
                        current: page ? page : 1,
                        max: Math.round(count / limit)
                    });
                });
            } else {
                cb(err);
            }
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

// advanced query:
// var demo = user.query('findOne',{name: 'demo'});
// demo.select('sth'); demo.exec(function(err,result){});
Ctrler.prototype.query = function(type, params) {
    if (this.type) {
        return model[this.type][type](params);
    }
}