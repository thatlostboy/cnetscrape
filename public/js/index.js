$(document).ready(function () {
  console.log("ready!");

  // scrape new unsaved articles at startup
  getNewArticles()

  /*
  Below are the onclick handlers:
      click button to clear mongodb and reload article
      click button to scrape for new articles that is not already in mongodb
      click button to save article to mongodb
  */

  // get new articles
  $(document).on("click", ".scrapeNewArticles", function () {
    getNewArticles();
  })

  // clear all articles on 
  $(document).on("click", ".clearArticles", function () {
    $.get("/api/clear").then(function(){
      // after successful function call.   Load new Articles
      getNewArticles();
    })
  })


  // save article to mongodb
  $(document).on("click", ".saveArticle", function () {

    //disable button
    $(this).attr("disabled", "disabled")


    //https://stackoverflow.com/questions/6647736/how-to-delete-parent-element-using-jquery
    let addObject = $(this).closest('.tagToSave')

    //grab data and store in object for saving
    let newObject = {}
    newObject['title'] = $(addObject).find(".articleTitle").text()
    newObject['link'] = $(addObject).find(".articleTitle").attr("href")
    newObject['summary'] = $(addObject).find(".articleSummary").text()
    console.log(newObject)


    // store to mongoDB
    $.post("/api/articles", newObject)
      .then(function (result) {
        console.log("Add successful!")
        console.log(result)

        // remove entry from screen
        addObject.remove();
      })

  })

});

var articleTemplate = `
<div class="tagToSave">
<div class="card text-left">
<div class="card-header">
  <h4><a class="articleTitle" href="{{link}}">{{title}}</a></h4>
</div>
<div class="card-body">
  <p class="card-title articleSummary">{{summary}}</p>
  <div class="text-right">
    <button class="btn btn-success saveArticle">ADD TO SAVED</button>
  </div>
</div>
</div>
<hr>
</div>
`

var noNewArticlesHTML = `
<hr>
<h3>No New Articles... Click on Scrape new LInk to see new articles or click saved page to see saved articles </h3>  
<hr>
`

var processingArticlesHTML = `
<hr>
<p>Loading Latest Articles... </p>  
<hr>`


// scrape new article and then udpate HTML page 
function getNewArticles() {

  // update table to notify we are loading new items
  $("#articleList").html(processingArticlesHTML)

  // scrape for new stories
  $.get("/api/scrapeNotSaved")
    .then(function (data) {
      console.log(data)
      if (data.length > 0) {
        console.log("I have data!  Will call update list function!")
        updateArticleList(data)
      } else {
        console.log("I do not have data!  will call no New articles function!")
        noNewArticles()
      }
    })
}

// update HTML page with new artiles
function updateArticleList(articleArray) {
  console.log("Listing!")
  let articleListHTML = ""
  articleArray.forEach(function (article) {
    console.log(article.title + "\n" + article.summary + "\n" + article.link)

    // create copy of Template
    let newArticle = articleTemplate

    // search replace
    newArticle = newArticle.replace(/{{title}}/, article.title)
    newArticle = newArticle.replace(/{{link}}/, article.link)
    newArticle = newArticle.replace(/{{summary}}/, article.summary)
    // console.log(newArticle)

    // append article to list
    articleListHTML += newArticle

  })
  // jquery to update article list
  $("#articleList").html(articleListHTML)
}

// update HTML page with default no new article
function noNewArticles() {
  $("#articleList").html(noNewArticlesHTML)
}


