var matcher = function(id) {
    return (id && id.match(/^[0-9a-fA-F]{24}$/));
}

var Ctrler = function(model) {
    this.model = model ? model : null;
}

Ctrler.prototype.checkId = matcher;

Ctrler.prototype.create = function(baby, callback) {
    if (this.model) this.model.create(baby, callback);
}

Ctrler.prototype.find = function(query, callback) {    
    if (this.model) this.model.find(query).exec(callback);
}

Ctrler.prototype.findOne = function(query, callback) {    
    if (this.model) this.model.findOne(query).exec(callback);
}

Ctrler.prototype.findById = function(id, callback) {    
    if (this.model) {
        if (matcher(id)) this.model.findById(id).exec(callback);
    }
}

Ctrler.prototype.update = function(id, update, callback) {
    if (this.model) {
        if (matcher(id)) this.model.findByIdAndUpdate(id, update, callback);
    }
}

Ctrler.prototype.updates = function(query, update, callback) {
    if (this.model) {
        if (matcher(id)) this.model.update(query, update, callback);
    }
}

Ctrler.prototype.updateOne = function(query, update, callback) {
    if (this.model) {
        this.model.findOneAndUpdate(query, update, callback);
    }
}

Ctrler.prototype.remove = function(id, callback) {
    if (this.model) {
        if (matcher(id)) this.model.findByIdAndRemove(id, callback);
    }
}

Ctrler.prototype.removes = function(query, callback) {
    if (this.model) {
        this.model.remove(query, callback);
    }
}

Ctrler.prototype.removeOne = function(query, callback) {
    if (this.model) {
        this.model.findOneAndRemove(query, callback);
    }
}

Ctrler.prototype.populate = function(doc, params, callback) {
    if (this.model) {
        this.model.populate(doc, params, callback);
    }
}

Ctrler.prototype.count = function(params, callback) {
    if (this.model) {
        var cb = (!callback && typeof(params) === 'function') ? params : callback,
            query = (params && typeof(params) === 'object') ? params : {};
        this.model.count(query, cb);
    }
}

Ctrler.prototype.list = function(params, callback) {
    if (this.model) {
        var cb = (!callback && typeof(params) === 'function') ? params : callback,
            query = (params && typeof(params) === 'object') ? params : {};
        this.model.find(query).exec(cb);
    }
}

Ctrler.prototype.page = function(page, limit, params, callback) {
    var self = this,
        from = (page && page > 1) ? ((page - 1) * limit) : 0;
    if (this.model) {
        self.model.count(params).exec(function(err, count) {
            if (!err) {
                self.model.find(params).skip(from).limit(limit).exec(function(err, results) {
                    callback(err, results, {
                        limit: limit,
                        current: page ? page : 1,
                        max: Math.round(count / limit)
                    });
                });
            } else {
                callback(err);
            }
        });
    }
}

module.exports = Ctrler;