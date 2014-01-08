
/*
 * GET proyecto listing.
 */
var ObjectID = require('mongodb').ObjectID;
var modelo = {
  actual: function(cb) {
    db = modelo.db;
    var proyectos = db.collection('proyectos');
    if (!this._id) {
      this._id = '__default__';
    }
    proyectos.find({"_id": this._id}).toArray(function (err, docs){
      if(docs.length) {
        cb(docs[0]);
      } else {
        proyectos.insert({nombre:"Default", _id:"__default__"},function(err, docs){
          cb(docs[0]);
        });
      }
    });  
  } 
};

exports.comprobar = function(req, res, cb){
  var db = req.db;
  if(!req.session.proyecto) {
    req.session.proyecto = '__default__';
  }
  if(req.param('proyecto')) {
    req.session.proyecto = req.param('proyecto');
  }
  modelo._id = req.session.proyecto;
  modelo.db = db;
  cb(req, res);
};

exports.guardar = function(db, obj, cb){
  var proyectos = db.collection('proyectos');
  proyectos.insert(obj,cb);
};

exports.traer = function(req, res) {
  modelo.actual(function(proy){
    res.send(proy);
  });
}

exports.modelo = modelo;





