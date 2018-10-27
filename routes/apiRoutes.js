var mongoose = require("mongoose");
var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

const baseURL = "http://www.cnet.com"

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/cnetscrape", { useNewUrlParser: true });

module.exports = function (app) {
  
  // get all the lates new section from cnn and puts into mongodb
  app.get("/api/scrapeadd", function (req, res) {
    axios.get(baseURL).then(function (response) {
      let $ = cheerio.load(response.data);

      let articleInfo = {}

      $("div.col-5 div.col-4").each(function (i, element) {
        // parse from html
        let headline = $(this).children("h3").text()
        let summary = $(this).children("p").text()
        let articleURL = $(this).children("h3").children("a").attr("href")
        let articleInfo = {
          title: headline,
          summary: summary,
          link: baseURL + articleURL

        }

        // write to mongodb and prevent adding if already exists
        // https://stackoverflow.com/questions/24122981/how-to-stop-insertion-of-duplicate-documents-in-a-mongodb-collection
        db.Article.update(articleInfo, articleInfo, { upsert: true })
          .then(function (dbArticle) {
            console.log(dbArticle)
          })
          .catch(function (err) {
            return res.json(err)
          })

      })
      res.send("Scrape is a Success!")
    })
  });
  

  // scrape cnet for latest news and return results as list
  app.get("/api/scrape", function (req, res) {
    axios.get(baseURL).then(function (response) {
      let $ = cheerio.load(response.data);


      let articleList = []

      $("div.col-5 div.col-4").each(function (i, element) {
        // parse from html
        let headline = $(this).children("h3").text()
        let summary = $(this).children("p").text()
        let articleURL = $(this).children("h3").children("a").attr("href")
        let articleInfo = {
          title: headline,
          summary: summary,
          link: baseURL + articleURL
        }
        articleList.push(articleInfo)
      })
      res.json(articleList)
    })
  });

  // get list of all saved articles from mongoDB
  app.get("/api/clear", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.remove({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        db.Note.remove({})
          .then(function(dbNote){
            res.json(dbArticle)
          })
          .catch(function(err){
            res.json(err)
          })
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
 

  // get list of all saved articles from mongoDB
  app.get("/api/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // delete a specific articles



  // save a specified article 
  app.post("/api/articles", function (req, res) {
  // write to mongodb and prevent adding if already exists
  // https://stackoverflow.com/questions/24122981/how-to-stop-insertion-of-duplicate-documents-in-a-mongodb-collection
    articleInfo = req.body
    db.Article.update(articleInfo, articleInfo, { upsert: true })
      .then(function (dbArticle) {
        console.log(dbArticle)
        res.json(articleInfo)
      })
      .catch(function (err) {
        return res.json(err)
      })

  })

  // get specific article
  app.get("/api/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.delete("/api/article/:id", function(req, res){
    console.log("delete a single article")
    // must delete all notes also
  })

  app.delete("/api/notes/:id", function(req, res){
    console.log("delete a single note")
    // must update the array in the notes field
  })


  // post a note to specific article, why isn't it sending everything?  
  app.post("/api/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    console.log("Body of response: ", req.body)
    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

        console.log("Did I make it here?!!")
        // https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { note: dbNote._id } },
          { new: true }
        );
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


};
