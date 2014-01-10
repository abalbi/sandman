
/*
 * GET eventos listing.
 */
var ObjectID = require('mongodb').ObjectID;
var proyecto = require('./proyecto');


var modelo = {
  parsear: function(evento) {
    if(!evento.parseado) {
      var descripcion = evento.descripcion.split(' ');
      evento.parseado = descripcion;
      for (var ii in descripcion){
        palabra = descripcion[ii];
        match = palabra.match(/^\[(.*)\]$/);
        if(match){
          descripcion[ii] = {"palabra": match[1]}
        } else {
          descripcion[ii] = {"palabra": palabra}
        }
      }
    }
    return evento; 
  }
};

exports.modelo = modelo;

exports.list = function(req, res){
  var db = req.db;
  var eventos = db.collection('eventos');
  eventos.find().toArray(function (err, docs){
    for (var i in docs) {
      var evento = docs[i];
      docs[i] = modelo.parsear(evento);
    }
    res.send(docs);
  });
};

exports.tabla = function(req, res){
  res.render('tabla', { title: 'Tabla' });
};

exports.traer = function(req, res) {
  var db = req.db;
  var eventos = db.collection('eventos');
  eventos.find({"_id": req.param('_id')}).toArray(function (err, docs){
    for (var i in docs) {
      var evento = docs[i];
      docs[i] = modelo.parsear(evento);
    }
    res.send(docs);
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
