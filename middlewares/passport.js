var passport = function(req, res, next, cb) {
    if (!req.session.user) return cb();
    res.locals.user = req.session.user;
    return next();
}

// middleware: check signin status
exports.check = function(checking, signin) {
    return function(req, res, next) {
        passport(req, res, next, function() {
            if (!checking) return next();
            if (!req.xhr) return res.redirect(signin ? signin : '/signin');
            res.json({
                stat: 'error',
                error: new Error('signin required')
            });
        });
    };
}

// router: signout
exports.signout = function(req, res) {
    if (!req.session.user) return res.redirect('back');
    delete req.session.user;
    return res.redirect('back');
};