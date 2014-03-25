var server = require('./server');
var configs = require('./configs/app.json');

// init a new server running on default port 3000
new server(configs)
    .models(function(db, Schema) {
      var userModel = new Schema({
        name: String,
        created: Date,
      });
      return {
        user: db.model('user', userModel)
      }
    })
    .ctrlers(function(models, Ctrler) {
      return {
        user: new Ctrler(models.user)
      }
    })
    .routes(function(app, ctrlers) {
      app.get('/', function(req, res, next) {
        res.render('index');
      });
      app.get('/error', function(req, res, next) {
        next(new Error('a Error Response Test'));
      });
      app.get('/users', function(req, res, next) {
        ctrlers.user.find({}, function(err, users) {
          res.json(users);
        });
      });
    })
    .run();