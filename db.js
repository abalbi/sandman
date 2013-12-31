var mongo = require('mongodb');
var monk = require('monk');
var db = {
	repo: 'dev',
	conn: function() {
	  return monk('localhost:27017/' + this.repo);
	}
};
exports.db = db;