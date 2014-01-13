exports.traer = function(req, res) {
  var db = req.db;
  var objetos = db.collection('objetos');
  var palabra = {
  	palabra: req.param('palabra')
  }
  objetos.find({"key": req.param('palabra')}).toArray(function (err, docs){
  	palabra.objetos = docs;
    res.send(palabra);
  });
}
