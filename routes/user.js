
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.tabla = function(req, res){
  res.render('tabla', { title: 'Tabla' });
};