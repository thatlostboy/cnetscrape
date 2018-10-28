$(document).ready(function () {

  /*
  Below are the onclick handlers:
      click button to clear mongodb 
      click button to delete article from mongodb
      click button to activate modal
      click button to delete note in modal
      click button to add note in modal
      click button to close modal
  */

  $(document).on("click", ".clearArticles", function () {
    $.get("/api/clear").then(function () {
      location.reload();
    })
  })

  $(document).on("click", ".delNote", function () {
    alert("delete note clicked")
  })

  $(document).on("click", ".saveNote", function () {
    alert("delete note clicked")
  })

  $(document).on("click", ".deleteArticle", function () {

    //disable button
    $(this).attr("disabled", "disabled")

    // grab data needed to identify document to remove in MongoDB
    let objectid = $(this).data("id")
    urlDelete = "/api/article/" + objectid
    console.log(urlDelete)

    //delete from mongoDB
    $.ajax({
      url: urlDelete,
      type: "DELETE",
    }).then(function () {
      console.log("I am in success delete handler")
      // delete the modal and card from the DOM
      cardID = "#card"+objectid
      modalID = "#modal"+objectid
      $(cardID).remove()
      $(modalID).remove()
    })
  })





})