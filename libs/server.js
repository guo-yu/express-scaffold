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
var Depender = require('depender');
var less = require('less-middleware');
var sass = require('node-sass').middleware;
var mongoStore = require('connect-mongo')(express);

/**
*
* Local dependencies
*
**/
var finder = require('./finder');
var sys = require('../package.json');
var db = require('../db/index');
var ctrler = require('../ctrlers/index');
var middlewares = require('../middlewares/index');
var defaults = require('../configs/default');

/**
*
* Expose main function
*
**/
module.exports = Server;

/**
*
* Server Class
* @configs[Object]: the config object, see `./configs/default` for more info.
*
**/
function Server(configs) {

  var dirs = {};
  var app = express();
  var settings = _.extend(_.clone(defaults), configs);

  if (settings.session.store) {
    settings.session.store = new mongoStore({ db: settings.database.name });
  }

  if (!settings.session.secret) {
    settings.session.secret = settings.database.name;
  }
  
  dirs.publics = finder(configs, 'public');
  dirs.uploads = finder(configs, 'uploads');

  // all environments
  app.set('env', settings.env);
  app.set('port', _.isNumber(parseInt(settings.port)) ? parseInt(settings.port) : defaults.port);
  app.set('views', finder(configs, 'views'));
  app.set('view engine', settings['view engine']);
  app.use(express.favicon());
  app.use(express.logger('production' !== settings.env ? 'dev' : settings.logformat));
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

  app.locals.sys = sys;
  app.locals.site = settings;
  app.locals.url = (settings.env === 'production') ? 
    settings.url : 
    'http://localhost:' + app.get('port');

  this.app = app;
  this.deps = new Depender;
  this.deps.define('middlewares', middlewares);
  this._settings = settings;

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
  this.deps.define('Schema', db.Schema);
  this.deps.define('db', db.connect(this._settings.database));
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
* @port[Number]: on which port we'll start.
*
**/
Server.prototype.run = function(port) {
  var app = this.app;
  if (_.isEmpty(app.routes)) this.routes();
  if (port && _.isNumber(parseInt(port))) app.set('port', parseInt(port));
  http.createServer(app).listen(app.get('port'));
  return this;
}