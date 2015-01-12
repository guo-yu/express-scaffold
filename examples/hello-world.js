// require Server class
var Server = require('..');

// create app instance and chain all stuff together,
// as you can see, express-scaffold injects models and ctrlers into
// app instance, it is a convenience way to organize all resource and modules
// which almost every route needs.
new Server({
  name: 'myApp',
  publics: './public',
  uploads: './uploads'
})
// finally, we're going to make all route work,
// `routes` function contains all routes your app will invoke.
.routes(function(app, ctrlers, express, debug) {
  // use new Router function in Express 4.x
  var Home = express.Router();
  Home.get('/', function(req, res, next){
    // debug output will not show unless DEBUG mode is on.
    // e.g:
    // $ DEBUG=My very first App:* node app.js
    debug('home')('It works');
    res.send('It works');
  });
  app.use('/', Home);

  // use app[Verb]
  app.get('/hello', function(req ,res, next){
    res.send('hello world');
  });

  // throw a fake error
  app.get('/errors', function(req, res, next){
    debug(500)(new Error('I am a fake error'));
    next(new Error('I am a fake error'));
  });
  
  // fake 404
  // new Error(404) is a custome error which redirect user to a 404 page.
  app.get('/404', function(req, res, next){
    next(new Error(404));
  });
})
.run();