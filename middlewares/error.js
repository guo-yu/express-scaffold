exports.json = function(code, err, res) {
  return res.json(code, {
    code: code,
    stat: 'error',
    error: err.message
  });
}

exports.render = function(code, err, res) {
  res.status(code);
  return res.render('error', {
    code: code,
    error: err
  });
}

exports.logger = function(err, req, res, next) {
  console.log(err);
  console.log(err.stack);
  return next(err);
}

// X-Requested-With: XMLHttpRequest
exports.xhr = function(err, req, res, next) {
  if (req.xhr) return exports.json(500, err, res);
  return next(err);
}

exports.common = function(err, req, res, next) {
  if (err.message === '404') return exports.notfound(req, res, next);
  return exports.render(500, err, res);
}

exports.notfound = function(req, res, next) {
  return res.format({
    text: function() {
      res.status(404);
      return res.send('404 Not found');
    },
    html: function() {
      return exports.render(404, req.url, res);
    },
    // Accept: application/json or */json
    json: function() {
      return exports.json(404, req.url, res);
    }
  });
}