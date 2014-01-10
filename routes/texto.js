var ObjectID = require('mongodb').ObjectID;

var modelo = {
  txt2tobj: function(texto) {
    var tobj = texto.split(' ');
    for (var i in tobj) {
      val = tobj[i];
      if(modelo.validar(val)) {
        tobj[i] = {"etiqueta": val}
      }
    }
    return tobj;
  },
  validar: function(palabra) {
  	var re = /^Gaia$/i;
  	var boo = false;
  	if(palabra.match(re)) {
      boo = true;
  	}
  	return boo;
  }
};

exports.modelo = modelo;