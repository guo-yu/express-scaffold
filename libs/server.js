var _ = require('underscore');
var depender = require('depender');

// Express core dependencies
var express = require('express');
var logger = require("morgan");
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');

// Local modules
var pkg = require('../package.json');
var utils = require('./utils');
var finder = require('./finder');
var debug = require('./debug');
var defaults = require('../configs');

var databases = {};
databases.mongodb = require('../databases/mongodb');

var controllers = {};
controllers.mongoose = require('../controllers/mongoose');

var middlewares = {};
middlewares.passport = require('express-passport');
middlewares.errors = require('express-common-errors');

// Load optional dependencies
var dependencies = utils.bootstrap();

// Expose main function
module.exports = Server;

// var mongoStore = require('connect-mongo')({ session: session });

/**
 * [Server Class]
 * @param {Object} configs [the config object]
 */
function Server(configs) {
  var dirs = {};
  var app = express();

  var env = process.env.NODE_ENV || 'development';
  var devMode = !(env === 'production');

  var settings = _.extend(_.clone(defaults), configs || {});
  var dbname =  databases.mongodb.isMongodbUri(settings.database) ? 
    databases.mongodb.parseDbname(settings.database) : 
    settings.database.name;
      
  if (settings.session.store) {
    var host = settings.session.host || 'localhost';
    var username = settings.database.options.user || '';
    var password = settings.database.options.pass || '';
    var port = _.isNumber(settings.session.port) ? parseInt(settings.database.port, 10) || 27017;
    settings.session.store = new mongoStore({ db: dbname, host: host, port: port, username: username, password: password });
  }

  if (!settings.session.secret)
    settings.session.secret = dbname;

  // Find `views` and `public` absolute path
  dirs.views = finder(configs, 'views');
  dirs.publics = finder(configs, 'publics');
  dirs.uploads = finder(configs, 'uploads');

  // Setup express settings
  app.set('env', env);
  app.set('views', dirs.views);
  app.set('view engine', settings['view engine']);
  app.set('port', process.env.PORT || 3000);

  if (devMode) 
    app.set('view cache', false);

  // Load express middlewares
  app.use(logger(devMode ? 'dev' : settings.logformat));

  if (dependencies.compression)
    app.use(dependencies.compression());

  app.use(bodyParser());

  if (dependencies.multer)
    app.use(dependencies.multer({ dest: dirs.uploads }));

  if (dependencies['method-override'])
    app.use(dependencies['method-override'](settings['method-override'] || {}));

  app.use(cookieParser(settings.session.secret));

  if (dependencies['express-session'])
    app.use(dependencies['express-session'](settings.session));

  if (dependencies['less-middleware'])
    app.use(dependencies['less-middleware'](dirs.publics));

  if (dependencies['node-sass-middleware'])
    app.use(dependencies['node-sass-middleware']({ src: dirs.publics }));

  app.use(express.static(dirs.publics));

  // Expose locals to template engine
  app.locals.sys = pkg;
  app.locals.site = settings;
  app.locals.settings = settings;
  app.locals.url = devMode ? 'http://127.0.0.1:' + app.get('port') : settings.url;
  app.locals.uri = app.locals.url;

  this.app = app;
  this.deps = new depender;
  this.deps.define('debug', debug(settings.name));
  this.deps.define('express', express);
  this.deps.define('middlewares', middlewares);

  this.settings = settings;

  if (settings.session.store)
    this.deps.define('sessionStore', settings.session.store);

  return this;
}

/**
 * [Define data models]
 * @param  {Function} fn [the callback function to return model object]
 */
Server.prototype.models = function(fn) {
  this.deps.define('Schema', databases.mongodb.Schema);
  this.deps.define('db', databases.mongodb.connect(this.settings.database));
  this.deps.define('models', this.deps.use(fn));
  return this;
}

/**
 * [Init Controllers instances]
 * @param  {Function} fn [the callback function to return spec controllers]
 */
Server.prototype.controllers = function(fn) {
  this.deps.define('Controller', controllers.mongoose);
  this.deps.define('controllers', this.deps.use(fn));
  return this;
}

/**
 * [Init routes]
 * @param  {Function} fn [index router]
 */
Server.prototype.routes = function(fn) {
  this.deps.define('app', this.app);
  this.deps.use(fn);

  this.app.use(middlewares.errors.logger);
  this.app.use(middlewares.errors.xhr);
  this.app.use(middlewares.errors.common);

  this.app.all('*', middlewares.errors.notfound); // 404
  return this;
}

// Start server instance
Server.prototype.run = function() {
  var app = this.app;
  var log = debug(this.settings.name)('http');

  log(
    '%s is running [%s][%s] @ %s', 
    this.settings.name, 
    app.locals.url,
    app.get('port'),
    app.get('env')
  );

  return app.listen(app.get('port'));
}

Server.prototype.listen = Server.prototype.run;
