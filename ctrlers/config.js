var Ctrler = require('./index');

exports = module.exports = function(config) {

    var Config = new Ctrler(config);

    Config.check = function(callback) {
        this.findOne({}).exec(function(err, c) {
            callback(err, !!c, c);
        });
    }

    return Config;

}