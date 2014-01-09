
/*
 * GET eventos listing.
 */
var ObjectID = require('mongodb').ObjectID;
var proyecto = require('./proyecto');

exports.list = function(req, res){
  var db = req.db;
  var eventos = db.collection('eventos');
  eventos.find().toArray(function (err, docs){
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
    res.send(docs);
  });
}

exports.borrar = function(req, res) {
  var db = req.db;
  var eventos = db.collection('eventos');
  console.log(req.param('_id'));
  eventos.remove({"_id": new ObjectID(req.param('_id'))}, {w:0}, function(err, docs){
    console.log(err);
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
