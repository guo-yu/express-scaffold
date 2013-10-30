// GET     /          ->  index
// GET     /new       ->  new
// POST    /          ->  create
// GET     /:id       ->  show
// GET     /:id/edit  ->  edit
// PUT     /:id       ->  update
// DELETE  /:id       ->  destroy

exports.index = function(req, res, next) {
    res.send('hi, It just works!');
}
exports.new = function(req, res, next) {
    res.send('new');
}
exports.create = function(req, res, next) {
    res.send('create');
}
exports.show = function(req, res, next) {
    res.send('show');
}
exports.edit = function(req, res, next) {
    res.send('edit');
}
exports.update = function(req, res, next) {
    res.send('update!');
}
exports.destroy = function(req, res, next) {
    res.send('destroy!');
}