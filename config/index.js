var config = {
    dev: {
        mode: 'dev',
        port: 3000,
        mongo: {
          host: '127.0.0.1',
          port: '27017',
          db: 'burgo_dev'
        }
    },
    test: {
        mode: 'test',
        port: 3001,
        mongo: {
          host: '127.0.0.1',
          port: '27017',
          db: 'burgo_test'
        }
    },
    production: {
        mode: 'production',
        port: 5000,
        mongo: {
          host: '127.0.0.1',
          port: '27017',
          db: 'sandman_prod'
        }
    }
}
module.exports = function(mode) {
    var fs = require('fs');
    return config[mode || process.argv[2] || 'dev'] || config.local;
}