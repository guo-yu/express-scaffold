exports = module.exports = function(app, configModel) {
    
    var config = require('../ctrlers/config')(configModel);

    return function(req, res, next) {
        
        if (app.get('configed')) {
            next();
            return true;
        }

        config.check(function(err, installed, configs) {
            if (!err) {
                if (installed) {
                    app.locals.site = configs;
                    app.enable('configed');
                    next();
                    return true;
                } else {
                    config.create(app.locals.site, function(err, c){
                        if (!err) app.enable('configed');
                        next(err);
                    });
                }
            } else {
                next(err);
            }
        });

    }
}