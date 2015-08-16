var mongojs = require('mongojs');

var mongo_URI = process.env.MONGOLAB_URI;
var db = mongojs(mongo_URI, ['pieces']);


module.exports.db = db;
