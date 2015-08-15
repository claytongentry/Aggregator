var express = require('express');
var mongojs = require('mongojs');
var app = express();

var mongo_URI = process.env.MONGOLAB_URI;
var db = mongojs(mongo_URI, ['pieces']);

console.log("Connected");

app.use(express.static(__dirname + "/public"));

app.get('/articlelist', function(req, res) {
  db.pieces.find(function(err, docs) {
    res.json(docs);
  });
});

var port = Number(process.env.PORT || 3000);

app.listen(port);
console.log("Cooking on " + port + "...");

module.exports.db = db;
