// sign
var passport = function(req, res, next, cb) {
    if (req.session.user) {
        res.locals.user = req.session.user;
        next()
    } else {
        cb();
    }
}

// PAGE: 登出
exports.signout = function(req, res) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('back');
    } else {
        res.redirect('back');
    }
};

// MIDDLEWARE: 检查用户是否登录
exports.check = function(req, res, next) {
    passport(req, res, next, function() {
        // Not-authed
        res.render('sign');
    });
}

// MIDDLEWARE: 检查用户是否登录（xhr）
exports.checkJSON = function(req, res, next) {
    passport(req, res, next, function() {
        next(new Error('login required'));
    });
}

// MIDDLEWARE: 为登录用户写入locals
exports.passport = function(req, res, next) {
    passport(req, res, next, function() {
        next();
    });
}

// MIDDLEWARE: 检查用户是否管理员用户
exports.checkAdmin = function(req, res, next) {
    if (res.locals.user && res.locals.user.type == 'admin') {
        next();
    } else {
        res.redirect('/');
    }
}