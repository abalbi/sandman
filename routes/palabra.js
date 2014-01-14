exports.traer = function(req, res) {
  var db = req.db;
  var objetos = db.collection('objetos');
  var palabra = {
  	palabra: req.param('palabra'),
  	objeto: null,
  	key: false,
  	alias: false
  }
  objetos.find({"$or":[{"key": palabra.palabra},{"keys": palabra.palabra}]}).toArray(function (err, docs){
  	for (i in docs) {
  	  var doc = docs[i];
  	  palabra.objeto = doc;
      if(doc.key == palabra.palabra) {
        palabra.key = true;
      } else {
      	palabra.alias = true;
      }
  	}
    res.send(palabra);
  });
}
