## ![logo](http://ww3.sinaimg.cn/large/61ff0de3jw1e91jmudlz8j201o01o0sj.jpg) express-scaffold ![npm](https://badge.fury.io/js/express-scaffold.png)

a simple MVC scaffold of Express project for production by [turing](https://npmjs.org/~turing) 

### Installation
````
$ git clone https://github.com/turingou/express-scaffold.git
$ cp -r ./express-scaffold ./my-project
$ cd my-project
$ cp app.sample.js app.js
$ vi app.js
````
### Project structure
this scaffold of Express provides a simple MVC structure:
- ctrlers
    - `index.js` a Ctrler factory which provides base database ctrler functions
    - `user.js` a sample instance of base ctrler
- views
    - `layout.jade` main layout
    - `error.jade` provides error interface
- model
    - `index.js` open database connection and define models(mongodb)
- routes
    - `*.js` app.js routers
- public static files

### Example App
app.js is your main script which is also a Server instance:
````javascript
var server = require('./server');

new server({
    name 'myApp',
    database: {
        name: 'expressdemo'
    }
}).run();
````
### Publish to production
just set `env` when creating server instance:
````javascript
var server = require('./server');

new server({
    name 'myApp',
    // set env to production
    env: 'production',
    // url should be provided. check it out in res.locals.root
    url: 'http://abc.com',
    database: {
        name: 'expressdemo',
        host: 'http://remoteDB',
        port: 27111,
        // check it out: 
        // http://mongoosejs.com/docs/api.html#index_Mongoose-createConnection
        options: {
            username: 'test',
            password: 'testpassword'
        }
    }
}).run(9999);
````
then `forever start app.js` or `pm2 start app.js -i max`

### API
check this file: `index.js`

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