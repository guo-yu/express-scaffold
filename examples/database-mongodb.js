// require Server class
var Server = require('..');

// create app instance and chain all stuff together,
// as you can see, express-scaffold injects models and ctrlers into
// app instance, it is a convenience way to organize all resource and modules
// which almost every route needs.
new Server({
  name: 'express-scaffold:example:mongodb',
  publics: './public',
  uploads: './uploads',
  // database: 'mongodb://localhost:27017/appdb',
  database: {
    name: 'appdb'
  }
})
// init models
// express-scaffold using `mongoose` to abstract data-models
// the object returned will be injected to `ctrlers` and `routes` functions
.models(function(db, Schema) {
  var userModel = new Schema({
    name: String,
    created: Date,
  });
  return {
    user: db.model('user', userModel)
  }
})
// init ctrlers
// express-scaffold will wrap all models into baseCtrler,
// which provides normal CRUS shortcuts function, e.g: 
// var user = new Ctrler(model.user);
// user.create()
// user.findById()
.controllers(function(models, Controller) {
  return {
    user: new Controller(models.user)
  }
})
// finally, we're going to make all route work,
// `routes` function contains all routes your app will invoke.
.routes(function(app, controllers, express, debug) {
  // find all users in database and return.
  app.get('/users', function(req, res, next){
    // using `user` controllers we made before to find all users,
    // and response with JSON string.
    controllers.user.find({}, response);

    function response(err, users) {
      if (err) 
        return next(err);
      
      debug('users')(users);
      res.json(users);
    }
  });
})
.run();