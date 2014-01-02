exports.json = function(code, err, res) {
    return res.json(code, {
        stat: 'error',
        error: err
    });
}

exports.render = function(code, err, res) {
    res.status(code);
    res.render('error', {
        code: code,
        error: err
    });
}

exports.logger = function(err, req, res, next) {
    console.log(err);
    console.log(err.stack);
    next(err);
}

exports.xhr = function(err, req, res, next) {
    if (req.xhr) return exports.json(200, err, res);
    next(err);
}

exports.common = function(err, req, res, next) {
    if (err.message === '404') return exports.notfound(req, res, next);
    exports.render(500, err, res);
}

exports.notfound = function(req, res, next) {
    res.status(404);
    res.format({
        text: function() {
            res.send('404 Not found');
        },
        html: function() {
            exports.render(404, req.url, res);
        },
        json: function() {
            exports.json(404, req.url, res);
        }
    });
}
