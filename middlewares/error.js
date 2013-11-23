exports.json = function(code, err, res) {
    res.json(code, {
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
    if (req.xhr) {
        exports.json(200, err, res);
    } else {
        next(err);
    }
}

exports.common = function(err, req, res, next) {
    exports.render(500, err, res);
}

exports.notfound = function(req, res, next) {
    res.status(404);
    res.format({
        text: function() {
            res.send('404');
        },
        html: function() {
            exports.render(404, req.url, res);
        },
        json: function() {
            exports.json(404, req.url, res);
        }
    });
}