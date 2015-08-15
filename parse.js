var Feedparser = require('feedparser');
var request = require('request');
var app = require('./app.js');

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
      entry.title = item.title;
      entry.author = item.author;
      entry.description = item.description.replace(/<(?:.|\n)*?>/gm, '');
      entry.summary = item.summary.replace(/<(?:.|\n)*?>/gm, '');
      entry.image = item.image.url;
      entry.date = item.date;
      entry.link = item.link;
      console.log(item);
      app.db.pieces.insert(entry);
    }

  });

}
