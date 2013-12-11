var http = require('http'),
    path = require('path'),
    _ = require('underscore'),
    express = require('express'),
    Depender = require('depender'),
    less = require('less-middleware'),
    Resource = require('express-resource'),
    MongoStore = require('connect-mongo')(express),
    sys = require('./package.json'),
    json = require('./libs/json'),
    middlewares = require('./middlewares/index'),
    routes = require('./routes/index');

var parentPath = function(dir) {
    return path.resolve(__dirname , '../../', dir);
};

var defaults = {
    port: 3000,
    env: 'development',
    views: path.join(__dirname, '/views'),
    public: path.join(__dirname, 'public'),
    uploads: path.join(__dirname, '/public/uploads'),
    uploadsLimit: '20mb',
    'view engine': 'jade',
    log: ":remote-addr|:date|:method|:url|:status|:res[content-length]|:response-time|\":referrer\"|\":user-agent\""
};

var Server = function(configs) {

    var app = express(),
        params = configs ? configs : {},
        secret = params.database && params.database.name ? params.database.name : sys.name,
        mongoStore = new MongoStore({ db: secret });

    if (params.database) json.save(path.join(__dirname, '/configs/database.json'), params.database);

    // all environments
    app.set('port', (params.port && !isNaN(parseInt(params.port, 10))) ? parseInt(params.port, 10) : defaults.port);
    app.set('env', params.env ? params.env : defaults.env);
    app.set('views', params.views ? parentPath(params.views) : defaults.views);
    app.set('view engine', params['view engine'] ? params['view engine'] : defaults['view engine']);
    app.set('log', params.log ? params.log : defaults.log);
    app.use(express.favicon());
    app.use(express.logger(app.get('env') !== 'production' ? 'dev' : app.get('log')));
    app.use(express.compress());
    app.use(express.limit(params.uploadsLimit ? params.uploadsLimit : defaults.uploadsLimit));
    app.use(express.bodyParser({keepExtensions: true, uploadDir: params.uploads ? parentPath(params.uploads) : defaults.uploads}));
    app.use(express.methodOverride());
    app.use(express.cookieParser(secret));
    app.use(express.session({ secret: secret, store: mongoStore }));
    app.use(less({src: params.public ? parentPath(params.public) : defaults.public }));
    app.use(express.static(params.public ? parentPath(params.public) : defaults.public ));
    app.use(app.router);

    // errors
    app.use(middlewares.error.logger);
    app.use(middlewares.error.xhr);
    app.use(middlewares.error.common);

    // locals
    app.locals.sys = sys;
    app.locals.site = params;
    app.locals.url = ('production' === app.get('env')) ? params.url : 'http://localhost:' + app.get('port');

    this.params = params;
    this.app = app;
    this.deps = new Depender;
    this.deps.define('$mongoStore', mongoStore);
    this.deps.define('$middlewares', middlewares);

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
    if (port && !isNaN(parseInt(port, 10))) app.set('port', parseInt(port, 10));
    http.createServer(app).listen(app.get('port'));
    return this;
}

module.exports = Server;