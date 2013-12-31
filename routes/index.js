
/*
 * GET home page.
 */

//db = require('../db').db;
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.db = function(req, res) {
  res.send(db);
}

