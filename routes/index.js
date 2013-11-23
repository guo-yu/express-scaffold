var home = require('./home'),
    auth = require('../middlewares/auth');

module.exports = function(app, ctrlers) {
    app.resource(home);
}