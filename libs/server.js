/**
*
* Global dependencies
*
**/
var _ = require('underscore');
var express = require('express');
var logger = require("morgan");
var compress = require('compression');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer  = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var depender = require('depender');
var less = require('less-middleware');
var sass = require('node-sass').middleware;
var mongoStore = require('connect-mongo')({ session: session });

/**
*
* Local dependencies
*
**/
var pkg = require('../package');
var finder = require('./finder');
var defaults = require('../configs');

var dbs = {};
dbs.mongodb = require('../dbs/mongodb');

var ctrlers = {};
ctrlers.mongoose = require('../ctrlers/mongoose');

var middlewares = {};
middlewares.passport = require('express-passport');
middlewares.errors = require('express-common-errors');

/**
*
* Expose main function
*
**/
module.exports = Server;

/**
*
* Server Class
* @configs[Object]: the config object, 
* checkout `./configs/default.js` for more infomation.
*
**/
function Server(configs) {

  var dirs = {};
  var devMode = true;
  var app = express();
  var settings = _.extend(_.clone(defaults), configs || {});

  if (settings.session.store) {
    settings.session.store = new mongoStore({ db: settings.database.name });
  }

  if (!settings.session.secret) {
    settings.session.secret = settings.database.name;
  }

  if (settings.env === 'production') devMode = false;

  // find `views` and `public` abs path
  dirs.views = finder(configs, 'views');
  dirs.publics = finder(configs, 'publics');
  dirs.uploads = finder(configs, 'uploads');

  // setup express settings
  app.set('env', settings.env);
  app.set('views', dirs.views);
  app.set('view engine', settings['view engine']);
  app.set('port', _.isNumber(settings.port) ? settings.port : defaults.port);

  // load all middlewares
  app.use(logger(devMode ? 'dev' : settings.logformat));
  app.use(compress());
  app.use(bodyParser());
  app.use(multer({ dest: dirs.uploads }));
  app.use(methodOverride());
  app.use(cookieParser(settings.session.secret));
  app.use(session(settings.session));
  app.use(less({ src: dirs.publics }));
  app.use(sass({ src: dirs.publics }));
  app.use(express.static(dirs.publics));

  // expose locals to template engine
  app.locals.sys = pkg;
  app.locals.site = settings;
  app.locals.url = devMode ? 'http://localhost:' + app.get('port') : settings.url

  this.app = app;
  this.deps = new depender;
  this.deps.define('express', express);
  this.deps.define('middlewares', middlewares);
  this.settings = settings;

  if (settings.session.store) {
    this.deps.define('sessionStore', settings.session.store);
  }

  return this;
}

/**
*
* Define data models
* @init[Function]: the callback function to return model object.
*
**/
Server.prototype.models = function(models) {
  this.deps.define('Schema', dbs.mongodb.Schema);
  this.deps.define('db', dbs.mongodb.connect(this.settings.database));
  this.deps.define('models', this.deps.use(models));
  return this;
}

/**
*
* Define spec Ctrlers
* @init[Function]: the callback function to return spec ctrlers.
*
**/
Server.prototype.ctrlers = function(controllers) {
  this.deps.define('Ctrler', ctrlers.mongoose);
  this.deps.define('ctrlers', this.deps.use(controllers));
  return this;
}

/**
*
* Define routes
* @init[Function]: the callback function to inject routes into `app`.
*
**/
Server.prototype.routes = function(routes) {
  this.deps.define('app', this.app);
  this.deps.use(routes);
  this.app.use(middlewares.errors.logger);
  this.app.use(middlewares.errors.xhr);
  this.app.use(middlewares.errors.common);
  this.app.all('*', middlewares.errors.notfound); // 404
  return this;
}

/**
*
* Start server instance
* @port[Number]: on which spec port we'll start.
*
**/
Server.prototype.run = function(port) {
  var app = this.app;
  var selectedPort = port && _.isNumber(port);
  if (selectedPort) app.set('port', port);
  return app.listen(app.get('port'));
}