var express = require('express'),
    http = require('http'),
    path = require('path'),
    MongoStore = require('connect-mongo')(express),
    less = require('less-middleware'),
    Resource = require('express-resource'),
    _ = require('underscore'),
    Depender = require('depender'),
    sys = require('./package.json'),
    json = require('./libs/json'),
    errors = require('./middlewares/error'),
    logger = require('./configs/log.json');

var Server = function(configs) {

    var app = express(),
        params = configs ? configs : {},
        secret = params.database && params.database.name ? params.database.name : sys.name;

    if (params.database) json.save(path.join(__dirname, '/configs/database.json'), params.database);

    // all environments
    app.set('port', (params.port && !isNaN(parseInt(params.port, 10))) ? parseInt(params.port, 10) : 3000);
    app.set('env', params.env && typeof(params.env) == 'string' ? params.env : 'development');
    app.set('views', params.views ? path.resolve(__dirname , '../../', params.views) : path.join(__dirname, '/views'));
    app.set('view engine', params['view engine'] ? params['view engine'] : 'jade');
    app.use(express.favicon());
    app.use(express.logger(app.get('env') === 'development' ? 'dev' : logger.production));
    app.use(express.compress());
    app.use(express.limit(params.limit ? params.limit : '20mb'));
    app.use(express.bodyParser({keepExtensions: true,uploadDir: path.join(__dirname, '/public/uploads')}));
    app.use(express.methodOverride());
    app.use(express.cookieParser(secret));
    app.use(express.session({ secret: secret, store: new MongoStore({ db: secret }) }));
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

    this.params = params;
    this.app = app;
    this.deps = new Depender;

    return this;
}

Server.prototype.routes = function(init) {
    var router = init ? init : require('./routes/index'),
        app = this.app;
    // define routes
    this.deps.define('app',this.app);
    this.deps.use(router);
    // 404
    app.get('*', errors.notfound);
    return this;
}

Server.prototype.models = function(init) {
    var models = require('./models/index');
    this.deps.define('$db',models.db);
    this.deps.define('$Schema',models.Schema);
    this.deps.define('$models', this.deps.use(init));
    return this;
}

Server.prototype.ctrlers = function(init) {
    this.deps.define('$Ctrler',require('./ctrlers/index'));
    this.deps.define('$ctrlers', this.deps.use(init));
    return this;
}

Server.prototype.run = function(port) {
    if (_.isEmpty(this.app.routes)) this.routes();
    if (port && !isNaN(parseInt(port, 10))) this.app.set('port', parseInt(port, 10));
    this.app.locals.url = (this.app.get('env') === 'production') ? this.params.url : 'http://localhost:' + this.app.get('port');
    http.createServer(this.app).listen(this.app.get('port'));
    return this;
}

module.exports = Server;