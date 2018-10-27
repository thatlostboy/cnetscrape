var mongoose = require("mongoose");
var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

const baseURL = "http://www.cnet.com"

module.exports = function(app) {
  // Get all examples
  app.get("/api/scrape", function(req, res) {
    axios.get(baseURL).then(function(response){
      let $ = cheerio.load(response.data);
      
      let articleInfo = {}

      $("div.col-5 div.col-4").each(function(i, element){
        let headline = $(this).children("h3").text()
        let summary = $(this).children("p").text()
        let articleURL = $(this).children("h3").children("a").attr("href")
        let articleInfo = {
          title: headline,
          summary: summary,
          link: baseURL+articleURL

        }
        console.log("--------------")
        console.log(articleInfo)

        // write to db
        db.Article.create(articleInfo)
          .then(function(dbArticle) {
            console.log(dbArticle)
          })
          .catch (function(err) {
            return res.json(err)
          })

      })
      res.send("Scrape is a Success!")
    })
  });

  // get list of all stories
  app.get("/api/articles", function(req, res) {
    res.send("get all articles")
  });

  // get specific storiy
  app.get("/api/articles/:id", function(req, res) {
    res.send(`get article with id:${req.params.id}`)

  });
};
