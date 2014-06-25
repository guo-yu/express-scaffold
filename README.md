## ![logo](http://ww3.sinaimg.cn/large/61ff0de3jw1e91jmudlz8j201o01o0sj.jpg) express-scaffold ![npm](https://badge.fury.io/js/express-scaffold.png)

a simple sexy MVC scaffold of Express, supporting [Candy](https://github.com/turingou/candy) and more and more web projects based on Node.js.

### Installation
````
$ npm install express-scaffold
````
### Quick start

We recommend using express-scaffold as a server module. by require express-scaffold, you could build a fast and stable website in just 1min.

````javascript
// require Server class
var Server = require('express-scaffold');

// create app instance and chain all stuff together,
// as you can see, express-scaffold injects models and ctrlers into
// app instance, it is a convenience way to organize all resource and modules
// which almost every route needs.
new Server({
  name: 'My very first App',
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
  app.get('/users', function(req, res, next){
    // using `user` ctrler we made before to find all users,
    // and response with JSON string.
    ctrlers.user.find({}, function(err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });
})
.run();
````

### Configs

all config params list below:
````javascript
{
  // site name
  name : "site name",
  // site desc
  description: 'demo site',
  // url should be provided. check it out in res.locals.url
  url: 'http://abc.com',
  // views dir:
  views: './views',
  // view engine:
  // default by jade
  "view engine": "jade",
  // database configs
  database: {
    name: 'expressdemo',
    host: 'http://remoteDB',
    port: 27111,
    options: {
      username: 'test',
      password: 'testpassword'
    }
  },
  // set a mongodb session store.
  session: {
    store: true
  }
}
````

### API
#### new Server(configObject)
#### server#models(db[, Schema])
#### server#ctrlers(models[, Ctrler])
#### server#routes(app[,ctrlers,[,models]])
#### server#run(port)

### Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2013 turing &lt;o.u.turing@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
![docor](https://cdn1.iconfinder.com/data/icons/windows8_icons_iconpharm/26/doctor.png)
generated using [docor](https://github.com/turingou/docor.git) @ 0.1.0. brought to you by [turingou](https://github.com/turingou)