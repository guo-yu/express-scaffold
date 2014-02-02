var http = require('http'),
    path = require('path'),
    _ = require('underscore'),
    express = require('express'),
    Depender = require('depender'),
    less = require('less-middleware'),
    Resource = require('express-resource'),
    mongoStore = require('connect-mongo')(express),
    sys = require('./package.json'),
    json = require('./libs/json'),
    routes = require('./routes/index'),
    middlewares = require('./middlewares/index');

var defaults = {
    port: 3000,
    env: 'development',
    'view engine': 'jade',
    views: path.join(__dirname, '/views'),
    public: path.join(__dirname, '/public'),
    uploads: path.join(__dirname, '/public/uploads'),
    uploadsLimit: '20mb',
    log: ":remote-addr|:date|:method|:url|:status|:res[content-length]|:response-time|\":referrer\"|\":user-agent\"",
    database: { name: sys.name },
    session: { secret: sys.name }
};

var dirfinder = function(configs, key) {
    if (configs[key]) return path.resolve(__dirname , '../../', configs[key]);
    return defaults[key];
};

var Server = function(configs) {

    var app = express(),
        settings = _.extend(defaults, configs);

    if (settings.database) json.save(path.join(__dirname, '/configs/database.json'), settings.database);
    if (settings.session.store) settings.session.store = new mongoStore({ db: settings.session.secret });

    // all environments
    app.set('env', settings.env);
    app.set('port', _.isNumber(parseInt(settings.port)) ? parseInt(settings.port) : defaults.port);
    app.set('views', dirfinder(configs,'views'));
    app.set('view engine', settings['view engine']);
    app.use(express.favicon());
    app.use(express.logger('production' !== settings.env ? 'dev' : settings.log));
    app.use(express.compress());
    app.use(express.limit(settings.uploadsLimit));
    app.use(express.bodyParser({keepExtensions: true, uploadDir: dirfinder(configs, 'uploads') }));
    app.use(express.methodOverride());
    app.use(express.cookieParser(settings.session.secret));
    app.use(express.session(settings.session));
    app.use(less({src: dirfinder(configs,'public') }));
    app.use(express.static(dirfinder(configs,'public')));
    app.use(app.router);

    // errors
    app.use(middlewares.error.logger);
    app.use(middlewares.error.xhr);
    app.use(middlewares.error.common);

    // locals
    app.locals.sys = sys;
    app.locals.site = settings;
    app.locals.url = ('production' === settings.env) ? settings.url : 'http://localhost:' + app.get('port');

    this.app = app;
    this.deps = new Depender;
    this.deps.define('$middlewares', middlewares);
    if (settings.session.store) this.deps.define('$sessionStore', settings.session.store);

    return this;
}

// define models
Server.prototype.models = function(init) {
    var models = require('./models/index');
    this.deps.define('$db',models.db);
    this.deps.define('$Schema',models.Schema);
    this.deps.define('$models', this.deps.use(init));
    return this;
}

// define ctrlers
Server.prototype.ctrlers = function(init) {
    this.deps.define('$Ctrler',require('./ctrlers/index'));
    this.deps.define('$ctrlers', this.deps.use(init));
    return this;
}

// inject app locals
Server.prototype.locals = function(key, value) {
    if (this.app && key && value) this.app.locals[key] = value;
    return this.app.locals;
}

// define routes
Server.prototype.routes = function(init) {
    this.deps.define('app', this.app);
    this.deps.use(init && typeof(init) === 'function' ? init : routes);
    this.app.get('*', middlewares.error.notfound);
    return this;
}

// start instance
Server.prototype.run = function(port) {
    var app = this.app;
    if (_.isEmpty(app.routes)) this.routes();
    if (port && _.isNumber(parseInt(port))) app.set('port', parseInt(port));
    http.createServer(app).listen(app.get('port'));
    return this;
}

module.exports = Server;
