var pkg = require('../package.json');

module.exports = {
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
    name: pkg.name
  },
  session: {
    secret: pkg.name,
    store: false
  }
}