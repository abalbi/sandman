
var ObjectID = require('mongodb').ObjectID;
var proyecto = require('./proyecto');

exports.guardar = function(req, res){
  var db = req.db;
  var obj = JSON.parse(req.param('obj'));
  var objetos = db.collection('objetos');
  if(obj._id) {
    var query = {_id:obj._id};
    delete obj._id;
    objetos.update(query,obj,{},function(err, docs){
      objetos.find({"_id": query._id}).toArray(function (err, docs){
        res.send(docs[0]);
      });
    });
  } else {
    objetos.insert(obj,function(err, docs){
      res.send(docs[0]);
    });
  }
};

exports.list = function(req, res){
  var db = req.db;
  var objetos = db.collection('eventos');
  objetos.find().toArray(function (err, docs){
    res.send(docs);
  });
};
