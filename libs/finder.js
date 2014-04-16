var path = require('path');
var defaults = require('../configs/default');

module.exports = function(configs, key) {
  if (configs[key]) {
    return path.resolve(__dirname, '../../../', configs[key]);
  }
  return defaults[key];
}