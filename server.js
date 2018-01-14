// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
// Initialize Express
var app = express();


mongoose.Promise = Promise;

// Set up a static folder (public) for our web app
app.use(express.static("public"));
app.set('views', __dirname + '/views');
app.engine("handlebars", exphbs({
  defaultLayout: "main",
}));
app.set("view engine", "handlebars");

//body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Database configuration
if (process.env.NODE_ENV == 'production') {
mongoose.connect('mongodb://heroku_sxvbj9nn:a9vgt9p1uripuruilqbo4b5o3q@ds237967.mlab.com:37967/heroku_sxvbj9nn');
} else {
  mongoose.connect('mongodb://localhost/news-scraper');

}
var db = mongoose.connection;


db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.get('/', function(req, res) {

  // loads home page
  res.redirect("/articles");
});


// Grabbing every p.title from each article
app.get("/scrape", function(req, res) {
  // Requesting for from the URL
  request("https://www.nytimes.com", function(error, response, html) {
    // Use cheerio
    var $ = cheerio.load(html);
    $("h2.story-heading").each(function(i, element) {
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element).children().text();
      result.link = $(element).children().attr("href");

      var entry = new Article(result);

      // Saving into the DB
      entry.save(function(err, doc) {

        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
    // Send a "Scrape Complete" message to the browser
    res.redirect("/articles");
  });
});

//get articles from the database
app.get("/articles", function(req, res) {
  Article.find({ $query: {"saved":false}, $sort: { "createdOn" : 1 } }, function(error, data){
    if (error) throw error;
    var hbsObject = {
      articles: data
    }
    res.render("index", hbsObject);
  });
});

//add to saved articles
app.post("/save/:id", function(req, res) {
  Article.update({
      "_id": req.params.id
    }, {
      $set: {
        "saved": true
      }
    })
    .exec(function(error, data) {
      if (error) throw error;
      res.redirect("/articles");
    });
});


//delete saved articles
app.post("/delete/:id", function(req, res) {
  Article.update({
      "_id": req.params.id
    }, {
      $set: {
        "saved": false
      }
    })
    .exec(function(error, data) {
      if (error) throw error;
      res.redirect("/saved");
    });
});


app.get("/saved", function(req, res) {
  Article.find({ $query: {"saved":true}, $sort: { "createdOn" : 1 } })
  .populate("note")
  .exec(function(error, data) {
    if (error) throw error;
    var hbsObject = {
      articles: data
    }
    res.render("article", hbsObject);
  });
});


//create new note for articles
app.post("/articles/:id", function(req, res) {
  var newNote = new Note(req.body);
  console.log(req.body);
  console.log(newNote);
  newNote.save(function(error, data) {
    if (error) throw error;
    Article.findOneAndUpdate({
        "_id": req.params.id
      }, {
        $push: {
          "note": data._id
        }
      }, {
        new: true
      })
      .exec(function(error, data) {
        if (error) throw error;
        res.redirect("/saved");
      });
  });
});


//delete note
app.delete("/notes/:id", function(req, res) {
  Note.remove({
    "_id": req.params.id
  }, function(error, data) {
    if (error) throw error;
    res.sendStatus(200);
  });
});



var port = process.env.PORT || 3000;
// Listen on port port
app.listen(port, function() {
  console.log("App running on port 3000!");
});
