exports = module.exports = function(app, configModel) {

    var config = require('../ctrlers/config')(configModel);

    return function(req, res, next) {

        if (app.get('configed')) return next();

        config.check(function(err, installed, configs) {
            if (err) return next(err);
            if (installed) {
                app.locals.site = configs;
                app.enable('configed');
                return next();
            } else {
                config.create(app.locals.site, function(err, c) {
                    if (!err) app.enable('configed');
                    next(err);
                });
            }
        });

    }
}