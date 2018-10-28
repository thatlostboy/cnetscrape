$(document).ready(function () {
  console.log("ready!");

  // scrape new Web Page at startup
  getNewArticles()

  // onclick handlers
  // get new articles
  $(document).on("click",".scrapeNewArticles", function(){
    getNewArticles();
  })

  // clear all articles on saved database
  $(document).on("click",".clearArticles", function(){
    alert("clear was clicked.  will call clear api then call scrape new articles function");
  })

  // add new articles
  $(document).on("click",".saveArticle", function(){
    alert("saved was clicked.  will need to create save function");
    //https://stackoverflow.com/questions/6647736/how-to-delete-parent-element-using-jquery
    
  })


});

var articleTemplate = `
<div class="card text-left tagToDelete">
<div class="card-header">
  <h4><a href="{{link}}">{{title}}</a></h4>
</div>
<div class="card-body">
  <p class="card-title">{{summary}}</p>
  <div class="text-right">
    <button class="btn btn-success saveArticle">ADD TO SAVED</button>
  </div>
</div>
</div>
<hr>
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

function getNewArticles() {

  $("#articleList").html(processingArticlesHTML)

  $.get("/api/scrapeNotSaved")
    .then(function (data) {
      console.log(data)
      if (data.length > 0) {
        console.log("I have data!  Will call render function!")
        updateArticleList(data)
      } else {
        console.log("I do not have data!  will call non render function!")
      }
    })
}

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
    console.log(newArticle)

    // append article to list
    articleListHTML += newArticle

  })
  // jquery to update article list
  $("#articleList").html(articleListHTML)
}

function noNewArticles() {
  $("#articleList").html(noNewArticlesHTML)
}



// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
