
/*
 * GET proyecto listing.
 */
var ObjectID = require('mongodb').ObjectID;

exports.comprobar = function(req, res, next){
  var db = req.db;
  var boo = false;
  if(req.param('proyecto')) {
    boo = true;
  }
  if(boo) {
    if(req.session.proyecto != req.param('proyecto')) {
      req.session.proyecto = req.param('proyecto');
    }
  }
  next();
};

exports.guardar = function(db, obj, cb){
  var proyectos = db.collection('proyectos');
  if(obj._id) {
    var query = {_id:new ObjectID(obj._id)};
    delete obj._id;
    eventos.update(query,obj,{},function(err, docs){
      eventos.find({"_id": query._id}).toArray(function (err, docs){
        res.send(docs[0]);
      });
    });
  } else {
    proyectos.insert(obj,cb);
  }
};

