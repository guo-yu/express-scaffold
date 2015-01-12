var debug = require('./debug');

exports.gatheringInformation = gatheringInformation;
exports.isLoadError = isLoadError;

function gatheringInformation(moduleName) {
  try {
    var module = require(moduleName);
    return module;
  } catch (err) {
    debug('utils')(err);
    return 'No ' + moduleName + ' module found, aborted.'
  }
}

function isLoadError(name) {
  return typeof(name) === 'string';
}

function bootstrap() {
  var pkg = require('../package.json');
  var modules = {};

  Object.keys(pkg.devDependencies).forEach(function(moduleName) {
    var m = gatheringInformation(moduleName);

    if (isLoadError(m))
      return debug('bootstrap')(m);

    modules[moduleName] = m;
  });

  return modules;
}
