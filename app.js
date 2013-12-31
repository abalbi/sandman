
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var evento = require('./routes/evento');
var http = require('http');
var path = require('path');
var config = require('./config')();
var MongoClient = require('mongodb').MongoClient;

var app = express();


// all environments
app.set('port', config.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        var attachDB = function(req, res, next) {
            req.db = db;
            next();
        };
        app.get('/', attachDB, routes.index);
        app.get('/users', attachDB, user.list);
        app.get('/eventos.json', attachDB, evento.list);
        app.get('/eventos', attachDB, evento.tabla);
        app.get('/evento/guardar', attachDB, evento.guardar);
        http.createServer(app).listen(config.port, function(){
            console.log('Express server listening on port ' + config.port);
        });
    }
});



