// require Server class
var Server = require('../index');

// create app instance and chain all stuff together,
// as you can see, express-scaffold injects models and ctrlers into
// app instance, it is a convenience way to organize all resource and modules
// which almost every route needs.
new Server({
  name: 'My very first App',
  publics: './public',
  uploads: './uploads',
  database: {
    name: 'appdb'
  }
})
.models(function(db, Schema) {
  // init models
  // express-scaffold using `mongoose` to abstract data-models
  // the object returned will be injected to `ctrlers` and `routes` functions
  var userModel = new Schema({
    name: String,
    created: Date,
  });
  return {
    user: db.model('user', userModel)
  }
})
.ctrlers(function(models, Ctrler) {
  // init ctrlers
  // express-scaffold will wrap all models into baseCtrler,
  // which provides normal CRUS shortcuts function, e.g: 
  // var user = new Ctrler(model.user);
  // user.create()
  // user.findById()
  return {
    user: new Ctrler(models.user)
  }
})
.routes(function(app, ctrlers) {
  console.log(app.locals.site.name + ' is running');
  // finally, we're going to make all route work,
  // `routes` function contains all routes your app will invoke.
  app.get('/', function(req ,res, next){
    res.send('hi');
  });
  app.get('/users', function(req, res, next){
    // using `user` ctrler we made before to find all users,
    // and response with JSON string.
    ctrlers.user.find({}, function(err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });
  app.get('/errors', function(req, res, next){
    next(new Error('I am a fake error'));
  });
  app.get('/fake404', function(req, res, next){
    next(new Error(404));
  });
})
.run();