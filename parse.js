var Feedparser = require('feedparser');
var request = require('request');
var mongojs = require('mongojs');
var moment = require('moment');

var mongo_URI = process.env.MONGOLAB_URI;
var db = mongojs(mongo_URI, ['pieces']);

module.exports.db = db; // App.js will want this^

// Remove articles more than 3 days old
db.pieces.createIndex({"pubDate": 1}, {expireAfterSeconds:259200});

var requests = [
  'http://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
  'https://www.reddit.com/r/internetisbeautiful/.rss',
  'http://feeds.washingtonpost.com/rss/rss_comic-riffs'
];

requests.forEach(function(current) {
  read_rss(current);
});

function read_rss(source) {

  var feedparser = new Feedparser();
  var req = request(source);

  req.on('error', function(error) {
    console.log("AAHHHHH: " + error);
  });

  req.on('response', function(res) {
    var stream = this;
    if (res.statusCode !== 200) return this.emit('error', new Error('Bad status code'));
    stream.pipe(feedparser);
  });

  feedparser.on('error', function(error) {
    console.log("COULD NOT PARSE. HERE'S WHY: " + error);
  });

  feedparser.on('readable', function() {
    var stream = this,
        meta = this.meta,
        entry = {},
        item;
    while (item = stream.read()) {
        // Only add to db if it's not already there
        db.pieces.update(
        {title:item.title},
        {$set:{
          "title":item.title,
          "author":item.author,
          "description":item.description.replace(/<(?:.|\n)*?>/gm, ''),
          "summary":item.summary.replace(/<(?:.|\n)*?>/gm, ''),
          "image":item.image.url,
          "pubDate":new Date(item.date),
          "link":item.link
        }},
        {upsert:true}
      );

    }

  });

}
