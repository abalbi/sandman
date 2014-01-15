
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var evento = require('./routes/evento');
var palabra = require('./routes/palabra');
var proyecto = require('./routes/proyecto');
var objeto = require('./routes/objeto');
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
app.use(express.session({secret: 'qwerty'}));
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
            db.collection('keys').ensureIndex({key:1},{unique:true}, function(){
              db.collection('objetos').ensureIndex({key:1},{unique:true}, function(){
                next();
              });
            });
        };
        var attachSession = proyecto.comprobar;
        app.get('/', attachDB, attachSession, evento.tabla);
        app.get('/users', attachDB, attachSession, user.list);
        app.get('/eventos.json', attachDB, attachSession, evento.list);
        app.get('/eventos.html', attachDB, attachSession, evento.tabla);
        app.get('/evento/guardar', attachDB, attachSession, evento.guardar);
        app.get('/evento/borrar', attachDB, attachSession, evento.borrar);
        app.get('/proyecto.json', attachDB, attachSession, proyecto.traer);
        app.get('/palabra/:palabra.json', attachDB, attachSession, palabra.traer);
        app.get('/objeto/guardar', attachDB, attachSession, objeto.guardar);
        app.get('/objetos', attachDB, attachSession, objeto.list);
        app.get('/objeto/:key.html', attachDB, attachSession, objeto.vista);
        app.get('/objeto/:key.json', attachDB, attachSession, objeto.traer);
        http.createServer(app).listen(config.port, function(){
            console.log('Express server listening on port ' + config.port);
        });
    }
});



