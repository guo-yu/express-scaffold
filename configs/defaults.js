var path = require('path');
var sys = require('../package.json');

exports.defaults = {
  port: 3000,
  limits: '20mb',
  env: 'development',
  'view engine': 'jade',
  views: path.resolve(__dirname, '../', './views'),
  public: path.resolve(__dirname, '../', './public'),
  uploads: path.resolve(__dirname, '../', './public/uploads'),
  logformat: ":remote-addr|:date|:method|:url|:status|:res[content-length]|" +
    ":response-time|\":referrer\"|\":user-agent\"",
  database: {
    name: sys.name
  },
  session: {
    secret: sys.name,
    store: false
  }
};

exports.finder = function(configs, key) {
  if (configs[key]) return path.resolve(__dirname, '../../../', configs[key]);
  return exports.defaults[key];
};