## ![logo](http://ww3.sinaimg.cn/large/61ff0de3jw1e91jmudlz8j201o01o0sj.jpg) express-scaffold ![npm](https://badge.fury.io/js/express-scaffold.png)

a simple but sexy MVC wrapper of Express

### Installation
````
$ npm install express-scaffold
````

### Quick start
you could use express-scaffold in two different styles:

#### Using it as server module

sample code here:
````javascript
var server = require('express-scaffold');

// init a new server running on default port 3000
new server({
        name: 'demo site',
        database: {
            name: 'testdb'
        }
    })
    .models(function($db, $Schema){
        var userModel = new $Schema({
            name: String,
            created: Date,
        });
        return {
            user: $db.model('user', userModel)
        }
    })
    .ctrlers(function($models, $Ctrler){
        return {
            user: new $Ctrler($models.user)
        }
    })
    .routes(function(app, $ctrlers){
        app.get('/users', function(req, res, next){
            $ctrlers.user.find({}, function(err, users){
                res.json(users);
            });
        });
    })
    .run();
````

#### Using it as project generator

if you don't want to require core server, just make a copy and start server:
````
$ git clone https://github.com/turingou/express-scaffold.git
$ cd express-scaffold
$ vi ./configs/app.json
$ node app.js
````

### Command-line tool

use express-scaffold as cli tool to quick generate project files
````
$ [sudo] npm install express-scaffold -g
$ mkdir demo-project && cd demo-project
$ express-scaffold
````

### Configs

config param goes here:
````javascript
{
    // site name
    name : "site name",
    // site desc
    desc: 'demo site',
    // set env to production
    env: 'production',
    // url should be provided. check it out in res.locals.root
    url: 'http://abc.com',
    // views dir:
    views: './views',
    // view engine:
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
    }
}).run(9999);
````
then `forever start app.js` or `pm2 start app.js -i max`

### Project structure
this scaffold of Express provides a simple MVC structure:
- ctrlers
    - `index.js` a Ctrler factory which provides base database ctrler functions
- views
    - all views in here
- model
    - `index.js` open database connection and define models(mongodb)
- routes
    - `*.js` app.js routers
- public
    - all static files locate here.

### API

- `/server.js`: init a server instance
- `/models/index.js`: exports a mongodb instance
- `/ctrlers/index.js`: exports a base ctrler (moogoose)

### Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2013 turing

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