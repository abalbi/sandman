
var ObjectID = require('mongodb').ObjectID;
var proyecto = require('./proyecto');

exports.vista = function(req, res){
  res.render('objeto', { title: req.param('key') });
};

exports.guardar = function(req, res){
  var db = req.db;
  var obj = JSON.parse(req.param('obj'));
  if(!obj.keys) {
    obj.keys = [];
  }
  if(obj.keys.indexOf(obj.key) == -1) {
    obj.keys.push(obj.key);
  }
  var objetos = db.collection('objetos');
  if(obj._id) {
    var query = {_id:new ObjectID(obj._id)};
    delete obj._id;
    objetos.update(query,obj,{},function(err, docs){
      objetos.find({"_id": query._id}).toArray(function (err, docs){
        res.send(docs[0]);
      });
    });
  } else {
    objetos.insert(obj,function(err, docs){
      if(err) {
        res.send(err);  
      } else {
        res.send(docs[0]);
      }
    });
  }
};

exports.list = function(req, res){
  var db = req.db;
  var objetos = db.collection('objetos');
  objetos.find().toArray(function (err, docs){
    res.send(docs);
  });
};

exports.traer = function(req, res) {
  var db = req.db;
  var objetos = db.collection('objetos');
  var key = req.param('key');
  objetos.find({"$or":[{"key": key},{"_id": key}]}).toArray(function (err, docs){
    res.send(docs);
  });
}

