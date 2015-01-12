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

  // Check environment vars
  var env = process.env.NODE_ENV || 'development';
  var production = (env === 'production');

  // Merge custom config to default configs.
  var settings = _.extend(_.clone(defaults), configs || {});

  // Check database configs
  if (settings.database) {
    // Check if databse uri is a mongdob uri.
    var database = settings.database = databases.mongodb.isMongodbUri(settings.database) ? 
        databases.mongodb.parseMongodbUri(settings.database) : 
        settings.database;

    // Check if we are going to persist sessions in mongodb
    if (database.type === 'mongodb' && settings.session.store && dependencies['connect-mongo'] && dependencies['express-session']) {
      var storeOptions = {
        db: database.name,
        host: database.host || 'localhost',
        port: database.port || 27017,
        username: settings.database.options.user || '',
        password: settings.database.options.pass || ''
      };

      // Create a mongo session store.
      var mongoStore = dependencies['connect-mongo']({ 
        session: dependencies['express-session']
      });

      // Replace store with a instance.
      settings.session.store = new mongoStore(storeOptions);
    }
  }

  // Find `views` and `public` absolute path
  dirs.views = finder(configs, 'views');
  dirs.publics = finder(configs, 'publics');
  dirs.uploads = finder(configs, 'uploads');

  // Setup express settings
  app.set('env', env);
  app.set('views', dirs.views);
  app.set('view engine', settings['view engine']);
  app.set('port', process.env.PORT || 3000);

  // Disable view chche in dev mode
  if (!production) 
    app.set('view cache', false);

  // Logger handler
  app.use(logger(production ? settings.logformat : 'dev'));

  // Compression handler
  if (dependencies.compression)
    app.use(dependencies.compression());

  // Request body parser
  // Parse `application/x-www-form-urlencoded`
  app.use(bodyParser.urlencoded({ extended: false }));
  // Parse `application/json`
  app.use(bodyParser.json())

  // Upload handler
  if (dependencies.multer)
    app.use(dependencies.multer({ dest: dirs.uploads }));

  if (dependencies['method-override'])
    app.use(dependencies['method-override'](settings['method-override'] || {}));

  app.use(cookieParser(settings.secret || settings.session.secret));

  // Session middleware
  if (dependencies['express-session'])
    app.use(dependencies['express-session'](settings.session));

  // Less and Sass middleware
  if (dependencies['less-middleware'])
    app.use(dependencies['less-middleware'](dirs.publics));
  if (dependencies['node-sass-middleware'])
    app.use(dependencies['node-sass-middleware']({ src: dirs.publics }));

  // Serve static files
  app.use(express.static(dirs.publics));

  // Expose locals to template engine
  app.locals.ENGINE = pkg;
  app.locals.SITE = settings;
  app.locals.SETTINGS = settings;
  app.locals.URL = production ? 
    (settings.url || settings.uri || 'http://127.0.0.1') :
    'http://127.0.0.1:' + app.get('port');
  app.locals.URI = app.locals.URL;

  this.app = app;
  this.deps = new depender();
  this.deps.define('debug', debug(settings.name));
  this.deps.define('express', express);
  this.deps.define('middlewares', middlewares);

  this.settings = settings;

  if (settings.session.store)
    this.deps.define('mongoStore', settings.session.store);

  return this;
}

/**
 * [Define data models]
 * @param  {Function} fn [the callback function to return model object]
 */
Server.prototype.models = function(fn) {
  if (!this.settings.databases)
    return this;

  if (this.settings.databases.type === 'mongodb') {
    this.deps.define('Schema', databases.mongodb.Schema);
    this.deps.define('db', databases.mongodb.connect(this.settings.database));
  }

  this.deps.define('models', this.deps.use(fn));

  return this;
};

/**
 * [Init Controllers instances]
 * @param  {Function} fn [the callback function to return spec controllers]
 */
Server.prototype.controllers = function(fn) {
  if (!this.settings.databases)
    return this;

  if (this.settings.databases.type === 'mongodb')
    this.deps.define('Controller', controllers.mongoose);

  this.deps.define('controllers', this.deps.use(fn));

  return this;
};

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
};

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
};
