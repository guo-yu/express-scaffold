// GET     /          ->  index
// GET     /new       ->  new
// POST    /          ->  create
// GET     /:id       ->  show
// GET     /:id/edit  ->  edit
// PUT     /:id       ->  update
// DELETE  /:id       ->  destroy

/**
 * GET index.
 */
exports.index = function(req, res, next) {
    res.send('hi, It just works!');
}
/**
 * GET new.
 */
exports.new = function(req, res, next) {
    res.send('new');
}
/**
 * POST create.
 */
exports.create = function(req, res, next) {
    res.send('create');
}
/**
 * GET show.
 */
exports.show = function(req, res, next) {
    res.send('show');
}
/**
 * GET edit.
 */
exports.edit = function(req, res, next) {
    res.send('edit');
}
/**
 * PUT update.
 */
exports.update = function(req, res, next) {
    res.send('update!');
}
/**
 * DELETE destroy.
 */
exports.destroy = function(req, res, next) {
    res.send('destroy!');
}