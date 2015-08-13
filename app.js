var express = require('express');
var mongojs = require('mongojs');
var app = express();

var mongo_URI = process.env.MONGOLAB_URI;
var db = mongojs(mongo_URI, ['pieces']);

console.log("Connected");

app.use(express.static(__dirname + "/public"));

app.get('/articlelist', function(req, res) {
  db.pieces.find(function(err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.listen(3000);
console.log("Cooking on 3000...");
