var path = require('path');
var pkg = require('./package');
var parent = path.resolve(__dirname, '../../');

// the port we're going to start,
// must be Number
exports.port = 3000;

// upload limit
exports.limits = '20mb';

// the environment app runs on
exports.env = 'development';

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

// the views folder dir,
// must be abs dir,
// by default, its where parent module locates
exports.publics = path.join(parent, './public');

// the views folder dir,
// must be abs dir,
// by default, its where parent module locates
exports.uploads = path.join(parent, './public/uploads');

// the log format when app runing on `production` mode
exports.logformat = ":remote-addr|:date|:method|:url|:status|:res[content-length]|:response-time|\":referrer\"|\":user-agent\"";

// the database information
// by default, express-scaffold using moogoose as mongodb driver
exports.database = {
  name: pkg.name
}

// the session infomation
// by default, express-scaffold using connect-mongo to presist sessions.
exports.session = {
  secret: pkg.name,
  // enable `session.store` to presist sessions,
  // by default, express-scaffold would not store sessions into databases.
  store: false
}