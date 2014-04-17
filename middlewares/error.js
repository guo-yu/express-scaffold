/**
 *
 * JSON string handler
 * callback with json string if nessersasy
 *
 **/
exports.json = function(code, err, res) {
  res.json(code, {
    code: code,
    stat: 'error',
    error: err.message
  });
}

/**
 *
 * Error Render
 * render `error` page if template exists.
 * if not, use default express err handler.
 *
 **/
exports.render = function(code, err, res) {
  res.status(code);
  res.render(code, {
    code: code,
    error: err
  }, function(renderError, html) {
    console.log(renderError);
    if (renderError) return res.send(code + '\n' + err);
    return res.send(html);
  });
}

/**
 *
 * Error logger
 * log every err and its stack to console.
 *
 **/
exports.logger = function(err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  return next(err);
}

/**
 *
 * Return JSON string if client maked as `X-Requested-With: XMLHttpRequest`
 *
 **/
exports.xhr = function(err, req, res, next) {
  if (!req.xhr) return next(err);
  return exports.json(500, err, res);
}

/**
 *
 * Common error handler
 *
 **/
exports.common = function(err, req, res, next) {
  if (err.message === '404') return exports.notfound(req, res, next);
  return exports.render(500, err, res);
}

/**
 *
 * Notfound error handler
 * if client marked as `Accept: application/json or *"/json`,
 * not found error handler will return json string.
 *
 **/
exports.notfound = function(req, res, next) {
  return res.format({
    text: function() {
      res.status(404);
      return res.send('404 Not found');
    },
    html: function() {
      return exports.render(404, req.url, res);
    },
    json: function() {
      return exports.json(404, req.url, res);
    }
  })
}