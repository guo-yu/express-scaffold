var fs = require('fs');

exports.fetch = function(file) {
    return JSON.parse(fs.readFileSync(file))
}

exports.set = function(file, obj) {
    if (obj && typeof(obj) == 'object') {
        fs.writeFileSync(file, JSON.stringify(obj));
        return obj;
    } else {
        return false;
    }
}