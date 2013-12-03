module.exports = function(req, res, next) {
    if (!res.locals.current) res.locals.current = req.url;
    next();
}