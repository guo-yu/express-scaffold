var Ctrler = require('./index'),
    model = require('../model/index');

var User = new Ctrler(model.user);

module.exports = User;