var mongoose = require("mongoose");
var db = require("../models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/cnetscrape", { useNewUrlParser: true });

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", {articles: dbArticle })
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      console.log(error)
      res.render("index")
    });
    
  });

  // Load saved page
  app.get("/saved", function(req, res) {
    db.Article.find({})
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("saved", {articles: dbArticle })
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      console.log(error)
      res.render(saved)
    });
    
  });


  // Load example page and pass in an example by id
  app.get("/article/:id", function(req, res) {
    res.render("example")
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
