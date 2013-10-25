var passport = function(req, res, next, cb) {
    if (req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else {
        cb();
    }
}

// MIDDLEWARE: check signin status
exports.check = function(req, res, next) {
    passport(req, res, next, function() {
        if (req.xhr) {
            next(new Error('signin required'));
        } else {
            res.render('sign');
        }
    });
}

// MIDDLEWARE: write res.locals.user in
exports.passport = function(req, res, next) {
    passport(req, res, next, function() {
        next();
    });
}

// PAGE: signout
exports.signout = function(req, res) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('back');
    } else {
        res.redirect('back');
    }
};
