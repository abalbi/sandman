
/*
 * GET eventos listing.
 */
var ObjectID = require('mongodb').ObjectID;

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

exports.guardar = function(req, res){
  var db = req.db;
  var obj = JSON.parse(req.param('obj'));
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
};
