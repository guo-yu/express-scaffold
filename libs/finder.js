var path = require('path');

module.exports = function(configs, key) {
  if (configs[key]) {
    return path.resolve(__dirname, '../../../', configs[key]);
  }
  return exports.defaults[key];
}