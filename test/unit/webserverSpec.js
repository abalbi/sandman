'use strict';

/* jasmine specs for controllers go here */

var proyecto;
var evento;
var config;
var MongoClient;
var db;
var objeto;
var palabra;

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
              proyecto.modelo.actual(function(proyecto){
                expect(proyecto._id).toBe('__algun_id_de_proyecto__');
              });
            }
          );
        });
      });
    });
  })
});

describe("Textos", function(){
  it("Debe convertir el texto en un array donde cada palabra pueda ser un texto o un objeto", function() {
    var texto = require('../../routes/texto');
    var tobj = texto.modelo.txt2tobj('Y Gaia vio a sus criaturas y de todas elegio a los Garou');
  });
});
describe("Objetos", function(){
  beforeEach(function(){
    proyecto = require('../../routes/proyecto');
    proyecto.modelo._id = '__default__';
    config = require('../../config')('test');
    MongoClient = require('mongodb').MongoClient;
    objeto = require('../../routes/objeto');
  });

  it('debe guardar un nuevo objeto', function(next){
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      proyecto.modelo.db = db;
      db.collection('objetos', function(err, objetos){
        objetos.drop();
        db.collection('keys', function(err, keys){
          keys.drop();
          objeto.guardar({
            "db":db,
            "param": function(name){
              return '{"key":"Ivana", "keys":["Petrova"]}';
            }
          },{
            send: function(docs){
              expect(docs.key).toBe('Ivana');
              expect(docs.keys.indexOf('Ivana')).not.toBe(-1);
              next();
            }
          });
        });
      });
    });
  });
  it("debe guardar un objeto guardado", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      proyecto.modelo.db = db;
      db.collection('objetos', function(err, collection){
        collection.drop();
        collection.insert([{"key":"Ivanaa"}],function(err, result){
          var id = result[0]._id;
          objeto.guardar({
            "db":db,
            "param": function(name){
              var json = '{"key":"Ivanaa","_id":"'+id+'"}';
              return json;
            }
          },{
            send: function(docs){
              expect(docs.key).toBe('Ivanaa');
              expect(docs.keys.indexOf('Ivanaa')).not.toBe(-1);
              next();
            }
          });
        });
      });
    });
  });
  it("debe traer la lista de objetos", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('objetos', function(err, collection){
        collection.drop();
        collection.insert([{"key":"Ivana"}],function(err, result){
          objeto.list({"db":db},{
            send: function(docs){
              expect(docs[0].key).toBe('Ivana');
              next();
            }
          });
        }); 
      });
    });
  });
  it("debe traer un objeto en particular por _id", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('objetos', function(err, collection){
        collection.drop();
        collection.insert([{"key":"Ivana"}],function(err, result){
          var id = result[0]._id;
          objeto.traer({
            "db":db,
            "param": function(name){
              return name == 'key' ? '' : id;
            }
          },{
            send: function(docs){
              expect(docs[0].key).toBe('Ivana');
              next();
            }
          });
        }); 
      });
    });
  });
  it("debe traer un objeto en particular por key", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('objetos', function(err, collection){
        collection.drop();
        collection.insert([{"key":"Ivana"}],function(err, result){
          var id = result[0]._id;
          objeto.traer({
            "db":db,
            "param": function(name){
              return name == 'key' ? 'Ivana' : '';
            }
          },{
            send: function(docs){
              expect(docs[0].key).toBe('Ivana');
              next();
            }
          });
        }); 
      });
    });
  });
  it("debe borrar un objeto en particular por _id", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('objetos', function(err, collection){
        collection.drop();
        collection.insert([{"key":"Luana", "keys":"Luana"}],function(err, result){
          var id = result[0]._id.toString();
          objeto.borrar({
            "db":db,
            "param": function(name){
              return name == 'key' ? '' : id;
            }
          },{
            send: function(docs){
              collection.find({"_id": id}).toArray(function (err, docs){
                expect(docs.length).toBe(0);
                next();
              });
            }
          });
        }); 
      });
    });
  });
  it("debe borrar un objeto en particular por key", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('objetos', function(err, collection){
        collection.drop();
        collection.insert([{"key":"Luana", "keys":"Luana"}],function(err, result){
          var id = result[0]._id.toString();
          objeto.borrar({
            "db":db,
            "param": function(name){
              return name == 'key' ? 'Luana' : '';
            }
          },{
            send: function(docs){
              collection.find({"_id": id}).toArray(function (err, docs){
                expect(docs.length).toBe(0);
                next();
              });
            }
          });
        }); 
      });
    });
  });

});
describe("Eventos", function(){
  beforeEach(function(){
    proyecto = require('../../routes/proyecto');
    proyecto.modelo._id = '__default__';
    config = require('../../config')('test');
    MongoClient = require('mongodb').MongoClient;
    evento = require('../../routes/evento');
    palabra = require('../../routes/palabra');
  });
  it("debe guardar un nuevo evento", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      proyecto.modelo.db = db;
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
            expect(docs.proyecto).toBe('__default__');
            next();
          }
        });
      });
    });
  });
  it("debe guardar un evento guardado", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      proyecto.modelo.db = db;
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
              expect(docs.proyecto).toBe('__default__');
              next();
            }
          });
        });
      });
    });
  });
  it("debe traer la lista de eventos", function(next) {
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
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('eventos', function(err, collection){
        collection.drop();
        collection.insert([{"lugar":"Lugar1","fecha":"1","descripcion":"Ivana Descripcion Lugar1 1"}],function(err, result){
          var id = result[0]._id;
          evento.traer({
            "db":db,
            "param": function(name){
              return id;
            }
          },{
            send: function(docs){
              expect(docs[0].lugar).toBe('Lugar1');
              expect(docs[0].descripcion).toBe('Ivana Descripcion Lugar1 1');
              expect(docs[0].parseado[0].palabra).toBe("Ivana");
              expect(docs[0].parseado[1].palabra).toBe('Descripcion');
              expect(docs[0].fecha).toBe('1');
              next();
            }
          });
        }); 
      }); 
    });
  });
  it("debe borrar un evento en particular", function(next) {
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      db.collection('eventos', function(err, collection){
        collection.drop();
        collection.insert([{"lugar":"Lugar1","fecha":"1","descripcion":"Descripcion Lugar1 1"}],function(err, result){
          var id = result[0]._id.toString();
          evento.borrar({
            "db":db,
            "param": function(name){
              return id;
            }
          },{
            send: function(docs){
              collection.find({"_id": id}).toArray(function (err, docs){
                expect(docs.length).toBe(0);
                next();
              });
            }
          });
        }); 
      });
    });
  });
  function eventoDescripcionMockData(db, next) {
    db.collection('objetos', function(err, objetos){
      objetos.drop();
      db.collection('keys', function(err, keys){
        keys.drop();
        objetos.insert(
          [
            {key: 'objeto1', keys:['objeto1', 'referencia'], tipo:"objeto"},
            {key: 'objeto2', keys:['objeto2'], tipo:"objeto"},
            {key: 'objeto3', keys:['objeto3'], tipo:"objeto"},
            {key: 'Peron', keys:['Peron',['Juan Peron']], tipo:"objeto"},
            {key: 'Lobos', keys:['Lobos'], tipo:"lugar"},
            {key: 'Isabelita', keys:['Isabel Peron','Isabelita'], tipo:"objeto"}
          ],
          function(err, result){
            next();
        });
      });
    });
  }
  it("debe crearse un conjunto de objetos para probar", function(next){
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      eventoDescripcionMockData(db, function(){
        var evts = [
          {descripcion: "objeto1 normal"},
          {descripcion: "objeto2 anormal"},
          {descripcion: "Silas trae denuevo a Peron. Isabel Peron Espera controlar asi a los descontentos y negociar con ellos contra la primogenitura"},
          {descripcion: "Peron nace en Lobos. [Juan Peron] vuelve a la vida"}

        ];
        evento.modelo.parsear(db, evts, function(evt2s) {
          console.log(evt2s[3]);
          expect(evt2s[0].descripcion).toBe('objeto1 normal');
          expect(evt2s[0].parseado[0].palabra).toBe('objeto1');
          expect(evt2s[0].parseado[0].clase).toBe('objeto');
          expect(evt2s[0].parseado[0].objeto).toBe('objeto1');
          expect(evt2s[0].parseado[1].palabra).toBe('normal');
          expect(evt2s[0].parseado[1].clase).toBe('');
          expect(evt2s[2].parseado[4].palabra).toBe('Peron');
          expect(evt2s[2].parseado[4].objeto).toBe('Peron');
          expect(evt2s[2].parseado[6].palabra).toBe('Isabel Peron');
          expect(evt2s[2].parseado[6].objeto).toBe('Isabelita');
          expect(evt2s[3].parseado[3].palabra).toBe('Lobos');
          expect(evt2s[3].parseado[3].clase).toBe('lugar');
          next();  
        });
      })
    });
  });
  it("debe devolver una descripcion de la palabra", function(next){
    MongoClient.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db, function(err, db) {
      eventoDescripcionMockData(db, function(){
        palabra.traer(
          {
            "db": db,
            param: function(){
              return 'Isabel Peron'
            }
          },
          {
            send: function(docs) {
              expect(docs.palabra).toBe('Isabel Peron');
              expect(docs.alias).toBe(true);
              expect(docs.key).toBe(false);
              expect(docs.objeto.keys.indexOf('Isabel Peron')).not.toBe(-1);
              next();
            }
          }
        );
      });        
    });
  });
});
