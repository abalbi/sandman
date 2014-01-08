'use strict';

/* jasmine specs for controllers go here */

describe('WebServer', function(){
  describe('Config', function(){
    it('debe cargar las configuraciones de dev', function(next) {
      var config = require('../../config')('dev');
      expect(config.mode).toBe('dev');
      next();
    });
    it('debe cargar las configuraciones de test', function(next) {
      var config = require('../../config')('test');
      expect(config.mode).toBe('test');
      next();
    });
  });
});

describe("MongoDB", function() {
  it("is there a server running", function(next) {
    var config = require('../../config')('dev');
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      expect(err).toBe(null);
      next();
    });
  });
});

describe("Proyectos", function(){
  var proyecto;
  var config;
  var MongoClient;
  beforeEach(function(){
    proyecto = require('../../routes/proyecto');
    config = require('../../config')('test');
    MongoClient = require('mongodb').MongoClient;

  });
  it('debe si no tiene proyecto de session definir __default__ y debe traerlo como actual', function() {
    var sess = {}; 
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      proyecto.comprobar(
        {session: sess, param: function(){return '';},"db":db},
        {},
        function(req, res){
          expect(req.session.proyecto).toBe('__default__');
          proyecto.modelo.actual(function(proyecto){
            expect(proyecto._id).toBe('__default__');
          });
        }
      );
    });
  })
  it('debe si defino previamente un proyecto debe definir eso como proyecto y debe traerlo como actual', function() {
    var sess = {proyecto:'__algun_id_de_proyecto__'};
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('proyectos', function(err, collection){
        collection.drop();
        collection.insert({_id:'__algun_id_de_proyecto__', nombre: 'Proyecto0'}, function(){
          proyecto.comprobar(
            {session: sess, param: function(){return '';},"db":db},
            {},
            function(req, res){
              expect(req.session.proyecto).toBe('__algun_id_de_proyecto__');
              proyecto.modelo.actual(function(proyecto){
                expect(proyecto._id).toBe('__algun_id_de_proyecto__');
              });
            }
          );
        });
      });
    });
  })
  it('debe si defino un param proyecto debe definir eso como proyecto y debe traerlo como actual', function() {
    var sess = {};
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('proyectos', function(err, collection){
        collection.drop();
        collection.insert({_id:'__algun_id_de_proyecto__', nombre: 'Proyecto0'}, function(){
          proyecto.comprobar(
            {session: sess, param: function(){return '__algun_id_de_proyecto__';},"db":db},
            {},
            function(req, res){
              expect(req.session.proyecto).toBe('__algun_id_de_proyecto__');
              proyecto.modelo.actual(function(proyecto){
                expect(proyecto._id).toBe('__algun_id_de_proyecto__');
              });
            }
          );
        });
      });
    });
  })
  it('debe existir siempre un proyecto __default__', function() {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('proyectos', function(err, collection){
        collection.drop();
        proyecto.modelo.db = db;
        proyecto.modelo._id = '';
        proyecto.modelo.actual(function(proyecto){
          expect(proyecto._id).toBe('__default__');
        });
      })      
    })
  })
  it('debe buscar el proyecto que se llama', function() {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('proyectos', function(err, collection){
        collection.drop();
        collection.insert({_id:'__algun_id_de_proyecto__', nombre: 'Proyecto0'}, function(){
          proyecto.modelo.db = db;
          proyecto.modelo._id = '__algun_id_de_proyecto__';
          proyecto.modelo.actual(function(proyecto){
            expect(proyecto._id).toBe('__algun_id_de_proyecto__');
          });
        });
      })      
    })
  })
});

describe("Eventos", function(){
  it("debe guardar un nuevo evento", function(next) {
    var config = require('../../config')('test');
    var evento = require('../../routes/evento');
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('eventos', function(err, collection){
        collection.drop();
        evento.guardar({
          "db":db,
          "param": function(name){
            return '{"lugar":"Lugar1","fecha":"1","descripcion":"Descripcion Lugar1 1 NUEVO"}';
          }
        },{
          send: function(docs){
            expect(docs.lugar).toBe('Lugar1');
            expect(docs.descripcion).toBe('Descripcion Lugar1 1 NUEVO');
            expect(docs.fecha).toBe('1');
            next();
          }
        });
      });
    });
  });
  it("debe guardar un evento guardado", function(next) {
    var config = require('../../config')('test');
    var evento = require('../../routes/evento');
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('eventos', function(err, collection){
        collection.drop();
        collection.insert([{"lugar":"Lugar1","fecha":"1","descripcion":"Descripcion Lugar1 1 NUEVO"}],function(err, result){
          var id = result[0]._id;
          evento.guardar({
            "db":db,
            "param": function(name){
              var json = '{"lugar":"Lugar1","fecha":"1","descripcion":"Descripcion Lugar1 1 CAMBIADO","_id":"'+id+'"}';
              return json;
            }
          },{
            send: function(docs){
              expect(docs.lugar).toBe('Lugar1');
              expect(docs.descripcion).toBe('Descripcion Lugar1 1 CAMBIADO');
              expect(docs.fecha).toBe('1');
              //expect(docs._id).toBe(new ObjectID(id));
              next();
            }
          });
        });
      });
    });
  });
  it("debe traer la lista de eventos", function(next) {
    var config = require('../../config')('test');
    var evento = require('../../routes/evento');
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('eventos', function(err, collection){
        collection.drop();
        collection.insert([{"lugar":"Lugar1","fecha":"1","descripcion":"Descripcion Lugar1 1"}],function(err, result){
          evento.list({"db":db},{
            send: function(docs){
              expect(docs[0].lugar).toBe('Lugar1');
              expect(docs[0].descripcion).toBe('Descripcion Lugar1 1');
              expect(docs[0].fecha).toBe('1');
              next();
            }
          });
        }); 
      });
    });
  });
  it("debe traer un evento en particular", function(next) {
    var config = require('../../config')('test');
    var evento = require('../../routes/evento');
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('eventos', function(err, collection){
        collection.drop();
        collection.insert([{"lugar":"Lugar1","fecha":"1","descripcion":"Descripcion Lugar1 1"}],function(err, result){
          var id = result[0]._id;
          evento.traer({
            "db":db,
            "param": function(name){
              return id;
            }
          },{
            send: function(docs){
              expect(docs[0].lugar).toBe('Lugar1');
              expect(docs[0].descripcion).toBe('Descripcion Lugar1 1');
              expect(docs[0].fecha).toBe('1');
              next();
            }
          });
        }); 
      });
    });
  });
});



