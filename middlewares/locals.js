exports.app = function(app) {
  return function(req, res, next) {
    if (!res.locals.app) res.locals.app = app;
    return next();
  };
}