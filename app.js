var server = require('./server'),
    configs = require('./configs/app.json');

// init a new server running on default port 3000
new server(configs).run();