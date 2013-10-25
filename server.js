var express = require('express'),
    http = require('http'),
    path = require('path'),
    MongoStore = require('connect-mongo')(express),
    less = require('less-middleware'),
    json = require('./libs/json'),
    sys = require('./package.json'),
    errors = require('./middlewares/error');

var Server = function(params) {

    if (params) {

        var app = express(),
            self = this;

        if (params.database) json.save(path.join(__dirname, '/database.json'), params.database);
        if (params.database && params.database.name) secret = params.database.name;

        // routers
        var index = require('./routes/index'),
            sign = require('./routes/sign');

        // all environments
        app.set('env', params.env && typeof(params.env) == 'string' ? params.env : 'development');
        app.set('views', path.join(__dirname, '/views'));
        app.set('view engine', 'jade');
        app.use(express.favicon(path.join(__dirname, '/public/images/favicon.ico')));
        app.use(express.logger('dev'));
        app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, '/public/uploads') }));
        app.use(express.methodOverride());
        app.use(express.cookieParser(secret));
        app.use(express.session({ secret: secret, store: new MongoStore({ db: secret, collection: 'sessions' }) }));
        app.use(less({ src: path.join(__dirname, 'public') }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(function(req, res, next) {
            if (!res.locals._app) res.locals._app = self.app;
            next();
        });
        app.use(app.router);

        // locals
        app.locals.sys = sys;
        app.locals.site = params;

        // errors
        app.use(errors.logger);
        app.use(errors.xhr);
        app.use(errors.common);

        // home
        app.get('/', sign.passport, index);

        // 404
        app.get('*', errors.notfound)

        self.app = app;
        self.params = params;

    }
    return this;
}

Server.prototype.run = function(port) {
    var defaultPort = 3000;
    if (this.app) {
        this.app.set('port', (port && !isNaN(parseInt(port, 10))) ? parseInt(port, 10) : defaultPort);
        this.app.locals.url = (this.app.get('env') === 'production') ? this.params.url : 'http://localhost:' + this.app.get('port');
        http.createServer(this.app).listen(this.app.get('port'));
        return this;
    } else {
        return false;
    }
}

module.exports = Server;