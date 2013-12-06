var passport = function(req, res, next, cb) {
    if (req.session.user) {
        res.locals.user = req.session.user;
        next()
    } else {
        cb();
    }
}

// middleware: check signin status
exports.check = function(checking, signin) {
    return function(req, res, next) {
        passport(req, res, next, function() {
            if (checking) {
                if (req.xhr) {
                    res.json({
                        stat: 'error',
                        error: new Error('signin required')
                    });
                } else {
                    res.redirect(signin ? signin : '/signin');
                }
            } else {
                next();
            }
        });
    }
}

// router: signout
exports.signout = function(req, res) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('back');
    } else {
        res.redirect('back');
    }
};