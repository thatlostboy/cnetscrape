$(document).ready(function () {

  /*
  Below are the onclick handlers:
      click button to clear mongodb 
      click button to delete article from mongodb
      click button to delete note in modal
      click button to add note in modal
      click button clear textarea box of modal
  */

  // clear articles from MongoDB handler
  $(document).on("click", ".clearArticles", function () {
    $.get("/api/clear").then(function () {
      location.reload();
    })
  })

  // clear contents of text box on click
  $(document).on("click", ".viewNotes", function(){
    let objectID = $(this).data("id")
    let textareaTag = "#noteAdd"+objectID
    $(textareaTag).val("")
  })


  // delete comment from mongodb event handler
  $(document).on("click", ".delNote", function () {

    //disable button
    $(this).attr("disabled", "disabled")

    // find note ID and create delete URL
    let noteID = $(this).data("id")
    let urlDelete = "/api/notes/" + noteID
    console.log(">>>>> ", urlDelete)

    // create noteTag to use to delete the note from DOM later
    let noteTag = "#note" + noteID

    //delete from mongoDB
    $.ajax({
      url: urlDelete,
      type: "DELETE",
    }).then(function () {
      console.log("I am in success delete note handler")
      // delete the card from DOM
      $(noteTag).remove()
    })

  })


  // save new coment to mongodb event handler
  $(document).on("click", ".saveNote", function () {
    //disable button
    $(this).attr("disabled", "disabled")

    // grab text from click area
    let articleID = $(this).data("id")
    let commentTag = "#noteAdd" + articleID
    let commentText = $(commentTag).val().trim()

    // post comment and close modal
    if (commentText) {

      // create content
      let addnoteURL = "api/articles/" + articleID
      let noteObj = {"body":commentText }

      // post to correct article
      $.post(addnoteURL, noteObj)
        .then(function (result) {

          // renable button
          $(this).removeAttr("disabled")

          // reload page
          location.reload();
        })

    } else {
      // renable button
      $(this).removeAttr("disabled")
    }

  })


  // delete article from mongodb event handler
  $(document).on("click", ".deleteArticle", function () {

    //disable button
    $(this).attr("disabled", "disabled")

    // grab data needed to identify document to remove in MongoDB
    let objectid = $(this).data("id")
    let urlDelete = "/api/article/" + objectid
    console.log(urlDelete)

    //delete from mongoDB
    $.ajax({
      url: urlDelete,
      type: "DELETE",
    }).then(function () {
      console.log("I am in success delete handler")
      // delete the modal and card from the DOM
      cardID = "#card" + objectid
      modalID = "#modal" + objectid
      $(cardID).remove()
      $(modalID).remove()
    })
  })

})