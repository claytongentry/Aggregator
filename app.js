var express = require('express');
var db = require('./db.js').db;

var app = express();

app.use(express.static(__dirname + "/public"));

app.get('/articlelist', function(req, res) {
  db.pieces.find().sort({pubDate:-1}, function(err, docs) {

    if (err) console.error(err);

    if (docs) {
      res.json(docs);
    }
    else {
      console.log("Nothing matches your search.");
    }

  });
});

var port = Number(process.env.PORT || 3000);

app.listen(port);
console.log("Cooking on " + port + "...");
