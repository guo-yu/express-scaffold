module.exports = Ctrler;

function Ctrler(model) {
  this.model = model || null;
}

Ctrler.prototype.checkId = checkId;
Ctrler.prototype.create = create;
Ctrler.prototype.find = find;
Ctrler.prototype.findOne = findOne;
Ctrler.prototype.findById = findById;
Ctrler.prototype.update = update;
Ctrler.prototype.updates = updates;
Ctrler.prototype.updateOne = updateOne;
Ctrler.prototype.remove = remove;
Ctrler.prototype.removes = removes;
Ctrler.prototype.removeOne = removeOne;
Ctrler.prototype.populate = populate;
Ctrler.prototype.count = count;
Ctrler.prototype.newbies = newbies;
Ctrler.prototype.list = list;
Ctrler.prototype.page = page;

function checkId(id) {
  return id && id.match(/^[0-9a-fA-F]{24}$/);
}

function create(baby, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  return this.model.create(baby, callback);
}

function find(query, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  if (query && callback) 
    return this.model.find(query).exec(callback);

  if (query && !callback) 
    return this.model.find(query);

  return false;
}

function findOne(query, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  if (query && callback) 
    return this.model.findOne(query).exec(callback);

  if (query && !callback) 
    return this.model.findOne(query);
}

function findById(id, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  if (!this.checkId(id)) 
    return callback(new Error('id required'));

  if (id && callback) 
    return this.model.findById(id).exec(callback);

  if (id && !callback) 
    return this.model.findById(id);
}

function update(id, update, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  if (!this.checkId(id)) 
    return callback(new Error('id required'));

  return this.model.findByIdAndUpdate(id, update, callback);
}

function updates(query, update, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  return this.model.update(query, update, callback);
}

function updateOne(query, update, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  return this.model.findOneAndUpdate(query, update, callback);
}

function remove(id, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  if (!this.checkId(id)) 
    return callback(new Error('id required'));

  return this.model.findByIdAndRemove(id, callback);
}

function removes(query, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  return this.model.remove(query, callback);
}

function removeOne(query, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  return this.model.findOneAndRemove(query, callback);
}

function populate(doc, params, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  this.model.populate(doc, params, callback);
}

function count(params, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  var cb = (!callback && typeof(params) === 'function') ? params : callback;
  var query = (params && typeof(params) === 'object') ? params : {};

  return this.model.count(query, cb);
}

function newbies(key, type, callback) {
  var today = new Date();
  var hour = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();
  var month = today.getMonth();
  var year = today.getFullYear();
  var day = today.getDate();
  var queryMap = {
    year: new Date(year.toString()),
    month: new Date(year,month),
    day: new Date(year,month,day),
    hour: new Date(year,month,day,hour,min,sec)
  };
  var query = {};
  var keyparam = key || 'created';
  query[keyparam] = {};
  query[keyparam].$lt = today;
  query[keyparam].$gt = type && queryMap[type] ? queryMap[type] : queryMap.day;

  return this.count(query).exec(callback);
}

function list(params, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  var cb = (!callback && typeof(params) === 'function') ? params : callback;
  var query = (params && typeof(params) === 'object') ? params : {};
  var cursor = this.model.find(query);

  if (cb) 
    return cursor.exec(cb);

  if (typeof(params) !== 'function' && !callback) 
    return cursor;
}

function page(page, limit, params, callback) {
  if (!this.model) 
    return callback(new Error('model required'));

  var self = this;
  var from = (page && page > 1) ? ((page - 1) * limit) : 0;
  var mainCursor = self.model.find(params).skip(from).limit(limit);
  var countCursor = self.model.count(params);
  var pager = {
    limit: limit,
    current: page ? page : 1
  };
  var ret = {
    query: mainCursor,
    count: countCursor,
    pager: pager
  };

  if (!(callback && typeof(callback) === 'function')) 
    return ret;

  return countCursor.exec(function(err, count) {
    if (err) return callback(err);
    pager.max = Math.round((count + limit - 1) / limit);
    mainCursor.exec(function(err, results) {
      callback(err, results, pager);
    });
  });
}
