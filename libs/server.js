/**
*
* Global dependencies
*
**/
var http = require('http');
var path = require('path');
var fs = require('fsplus');
var _ = require('underscore');
var express = require('express');
var depender = require('depender');
var less = require('less-middleware');
var sass = require('node-sass').middleware;
var mongoStore = require('connect-mongo')(express);

/**
*
* Local dependencies
*
**/
var finder = require('./finder');
var pkg = require('../package');
var mongodb = require('../dbs/mongodb');
var ctrler = require('../ctrlers/index');
var middlewares = require('../middlewares/index');
var defaults = require('../configs');

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
  dirs.publics = finder(configs, 'public');
  dirs.uploads = finder(configs, 'uploads');

  // setup server environments
  app.set('env', settings.env);
  app.set('views', dirs.views);
  app.set('view engine', settings['view engine']);
  app.set('port', _.isNumber(settings.port) ? settings.port : defaults.port);

  // load all middlewares
  app.use(express.favicon());
  app.use(express.logger(devMode ? 'dev' : settings.logformat));
  app.use(express.compress());
  app.use(express.limit(settings.limits));
  app.use(express.bodyParser({ keepExtensions: true, uploadDir: dirs.uploads }));
  app.use(express.methodOverride());
  app.use(express.cookieParser(settings.session.secret));
  app.use(express.session(settings.session));
  app.use(less({ src: dirs.publics }));
  app.use(sass({ src: dirs.publics }));
  app.use(express.static(dirs.publics));
  app.use(app.router);
  app.use(middlewares.error.logger);
  app.use(middlewares.error.xhr);
  app.use(middlewares.error.common);

  app.locals.sys = pkg;
  app.locals.site = settings;
  app.locals.url = devMode ? 'http://localhost:' + app.get('port') : settings.url

  this.app = app;
  this.deps = new depender;
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
Server.prototype.models = function(init) {
  this.deps.define('Schema', mongodb.Schema);
  this.deps.define('db', mongodb.connect(this.settings.database));
  this.deps.define('models', this.deps.use(init));
  return this;
}

/**
*
* Define spec Ctrlers
* @init[Function]: the callback function to return spec ctrlers.
*
**/
Server.prototype.ctrlers = function(init) {
  this.deps.define('Ctrler', ctrler);
  this.deps.define('ctrlers', this.deps.use(init));
  return this;
}

/**
*
* Define routes
* @init[Function]: the callback function to inject routes into `app`.
*
**/
Server.prototype.routes = function(init) {
  this.deps.define('app', this.app);
  this.deps.use(init);
  this.app.all('*', middlewares.error.notfound); // 404
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
  return http.createServer(app).listen(app.get('port'));
}