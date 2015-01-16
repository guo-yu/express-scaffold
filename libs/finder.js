var path = require('path');
var _ = require('underscore');
var defaults = require('../configs');
var parent = path.resolve(__dirname, '../../../');

module.exports = finder;

function finder(configs, key) {
  if (!configs || !_.isObject(configs) || !configs[key]) 
    return defaults[key]; 
  
  return path.join(parent, configs[key]);  
}
