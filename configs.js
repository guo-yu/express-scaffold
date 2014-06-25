var path = require('path');
var pkg = require('./package');
var parent = path.resolve(__dirname, '../../');

// upload limit
// by default, the limit is 20mb
// NOTE: this middleware is currently no longer built in Express 4.x
// exports.limits = '20mb';

// the URI where app will be public
// this url will be stored as `app.locals.url`,
// and can be printed as template tag #{url}
// by default, it is not enabled.
// exports.url = 'http://yourApp.com';

// the default view engine's name
exports['view engine'] = 'jade';

// the views folder dir,
// must be abs dir,
// by default, its where parent module locates
exports.views = path.join(parent, './views');

// the public folder dir,
// must be abs dir,
// by default, its where parent module locates
exports.publics = path.join(parent, './public');

// the uploads folder dir,
// must be abs dir,
// by default, its where parent module locates
exports.uploads = path.join(parent, './public/uploads');

// the log format when app runing on `production` mode
exports.logformat = ":remote-addr|:date|:method|:url|:status|:res[content-length]|:response-time|\":referrer\"|\":user-agent\"";

// the database information
// by default, express-scaffold using moogoose as mongodb driver
// a mongodb URI can be used to replace this object, e.g: 
// exports.database = 'mongodb://user:pass@localhost:port/database';
exports.database = {
  name: pkg.name
}

// the session infomation
// by default, express-scaffold using connect-mongo to presist sessions.
// this config param must be a Object.
exports.session = {
  secret: pkg.name,
  // enable `session.store` to presist sessions,
  // by default, express-scaffold would not store sessions into databases.
  store: false
}