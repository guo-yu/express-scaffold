var path = require('path');
var express = require('express');
var json = require('../libs/json');

exports.basic = express.basicAuth;

exports.admin = (function() {
  var admin = json.fetch(path.resolve(__dirname, '../configs/admin.json'));
  if (admin && admin.name && admin.password) return this.basic(admin.name, admin.password);
  return this.basic('admin', '123');
})();