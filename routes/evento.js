
/*
 * GET eventos listing.
 */
var ObjectID = require('mongodb').ObjectID;
var proyecto = require('./proyecto');


var modelo = {
  split_descripcion: function(evento){
    var str = evento.descripcion;
    str = str.replace(/\[(.*)\]/, function(mat,palabra){
      var palabra = palabra.replace(' ', '_');
      return palabra;
    });
    str = str.replace('.',' .');
    str = str.replace(',',' ,');
    var array = str.split(' ');
    for (i in array) {
      palabra = array[i];
      array[i] = palabra.replace('_',' ');
    }
    return array;
  },
  parsear: function(db, eventos, next) {
    var indice = {};
    var palabras = [];
    for(ievt in eventos) {
      evento = eventos[ievt];
      var descripcion = modelo.split_descripcion(evento);
      for(i in descripcion) {
        var palabra = descripcion[i];
        if(!indice[palabra]) {
          indice[palabra] = {palabra:palabra, clase:''};
          palabras.push(palabra);
        }
      }
    }
    db.collection('objetos').find({keys:{$in:palabras}}).toArray(function (err, docs){
      for(ii in docs){
        doc = docs[ii];
        for(iiiii in doc) {
          key = doc[iiiii];
          if(indice[key]) {
            indice[key].clase = 'objeto';
          }
        }
      }
      for(iii in eventos) {
        var evento = eventos[iii];
        if(!evento.parseado) {
          evento.parseado = [];
        }
        var descripcion = modelo.split_descripcion(evento);
        for(iiii in descripcion) {
          palabra = descripcion[iiii];
          evento.parseado.push(indice[palabra]);
        }
      }
      next(eventos);
    });
  },
};

exports.modelo = modelo;

exports.list = function(req, res){
  var db = req.db;
  var eventos = db.collection('eventos');
  eventos.find().toArray(function (err, docs){
    modelo.parsear(db, docs, function() {
      res.send(docs);  
    })
  });
};

exports.tabla = function(req, res){
  res.render('tabla', { title: 'Tabla' });
};

exports.traer = function(req, res) {
  var db = req.db;
  var eventos = db.collection('eventos');
  eventos.find({"_id": req.param('_id')}).toArray(function (err, docs){
    modelo.parsear(db, docs, function() {
      res.send(docs);  
    })
  });
}

exports.borrar = function(req, res) {
  var db = req.db;
  var eventos = db.collection('eventos');
  eventos.remove({"_id": new ObjectID(req.param('_id'))}, {w:1}, function(err, docs){
    res.send([]);
  });
}

exports.guardar = function(req, res){
  var db = req.db;
  var obj = JSON.parse(req.param('obj'));
  proyecto.modelo.actual(function(proy){
    obj.proyecto = proy._id;
    var eventos = db.collection('eventos');
    if(obj._id) {
      var query = {_id:new ObjectID(obj._id)};
      delete obj._id;
      eventos.update(query,obj,{},function(err, docs){
        eventos.find({"_id": query._id}).toArray(function (err, docs){
          res.send(docs[0]);
        });
      });
    } else {
      eventos.insert(obj,function(err, docs){
        res.send(docs[0]);
      });
    }
  });
};
