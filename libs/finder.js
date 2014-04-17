var path = require('path');
var defaults = require('../configs');
var parent = path.resolve(__dirname, '../../../');

module.exports = function(configs, key) {
  if (!configs[key]) return defaults[key]; 
  return path.join(parent, configs[key]);  
}