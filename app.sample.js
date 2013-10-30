var server = require('./server');

// init a new server running on port 3000
new server({
    name: 'demoApp',
    desc: 'as you like',
    database: {
        name: 'expressdemo'
    }
}).run();