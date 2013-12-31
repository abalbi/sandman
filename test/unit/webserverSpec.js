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



