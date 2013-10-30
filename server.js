var express = require('express'),
    http = require('http'),
    path = require('path'),
    member = require('member'),
    less = require('less-middleware'),
    json = require('./libs/json'),
    sys = require('./package.json'),
    errors = require('./middlewares/error');

var Server = function(configs) {

    var app = express(),
        router = require('./routes/index');
        params = configs ? configs : {},
        secret = params.database && params.database.name ? params.database.name : sys.name;

    if (params.database) json.save(path.join(__dirname, '/database.json'), params.database);

    // all environments
    app.set('env', params.env && typeof(params.env) == 'string' ? params.env : 'development');
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({keepExtensions: true,uploadDir: path.join(__dirname, '/public/uploads')}));
    app.use(express.methodOverride());
    app.use(express.cookieParser(secret));
    app.use(express.session({ secret: secret, store: member.session(express, {db: secret}) }));
    app.use(less({src: path.join(__dirname, 'public')}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);

    // errors
    app.use(errors.logger);
    app.use(errors.xhr);
    app.use(errors.common);

    // locals
    app.locals.sys = sys;
    app.locals.site = params;

    // routes
    router(app);

    // 404
    app.get('*', errors.notfound)

    this.app = app;

    return this;
}

Server.prototype.run = function(port) {
    var defaultPort = 3000;
    this.app.set('port', (port && !isNaN(parseInt(port, 10))) ? parseInt(port, 10) : defaultPort);
    this.app.locals.url = (this.app.get('env') === 'production') ? this.params.url : 'http://localhost:' + this.app.get('port');
    http.createServer(this.app).listen(this.app.get('port'));
}

module.exports = Server;