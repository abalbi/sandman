
/*
 * GET eventos listing.
 */
var ObjectID = require('mongodb').ObjectID;
var proyecto = require('./proyecto');


var modelo = {
  indice: function(db,cb){
    var indice = {
      data: {}
    };
    db.collection('objetos').find().toArray(function (err, docs){
      for (i in docs) {
        var doc = docs[i];
        indice.data[doc.key] = doc;
        if(doc.keys) {
          for (ii in doc.keys) {
            var key = doc.keys[ii];
            indice.data[key] = doc;
          }
        }
      }
      var antes = [];
      var despues = [];
      for(prop in indice.data) {
        var item = indice.data[prop];
        if(prop.match(/ /)) {
           antes.push(prop);
        } else {
           despues.push(prop);
        }
      }
      indice.orden = antes.concat(despues);
      cb(indice);
    });
  },
  parsear: function(db, eventos, next) {
    this.indice(db, function(indice){
      for(ievt in eventos) {
        var parseado = [];
        evento = eventos[ievt];
        desc = evento.descripcion;
        desc = desc.replace(/\[/,'').replace(/\]/,'');
        for (o in indice.orden) {
          var i = indice.orden[o];
          var re = new RegExp(''+i+'','g');
          desc = desc.replace(re,function(match,pre,palabra,post){
            return '['+match+']';
          },'g')
        }
        desc = desc.replace(/\[([^\]]*\[.*)\]/g, function(match,p1){
          return '['+p1.replace(/\[/,'').replace(/\]/,'')+']';
        });
        var c = 0;
        console.log(desc);
        while(desc){
          var palabra = {
            clase: ""
          };
          var boo = false;
          desc = desc.replace(/^\[([^\]]+)\]/,function(match,p1){
            palabra.palabra = p1;
            console.log(p1);
            console.log(indice.data[p1]);
            palabra.clase = indice.data[p1].tipo;
            palabra.objeto = indice.data[p1].key;
            if(!evento.keys) {
              evento.keys = {};
            }
            evento.keys[palabra.objeto] = palabra.objeto;
            parseado[c] = palabra;
            boo = true;
            return '';
          });
          if(boo) {c++;continue}
          desc = desc.replace(/^[^ ]+/,function(match){
            palabra.palabra = match;
            parseado[c] = palabra;
            boo = true;
            return '';
          });
          if(boo) {c++;continue}
          desc = desc.replace(/^ */,function(match){
            return '';
          });
        }
        evento.parseado = parseado;
      }
      next(eventos);
    });
  }
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
