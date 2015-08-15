var express = require('express');
var parse = require('./parse.js');
var app = express();

console.log("Connected");

app.use(express.static(__dirname + "/public"));

app.get('/articlelist', function(req, res) {
  parse.db.pieces.find(function(err, docs) {
    res.json(docs);
  });
});

var port = Number(process.env.PORT || 3000);

app.listen(port);
console.log("Cooking on " + port + "...");
