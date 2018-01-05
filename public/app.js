$(document).ready(function() {
  // URL root (so it works in eith Local Host for Heroku)
  var baseURL = window.location.origin;

  //go to homepage
  $("#home").on("click", function() {
    $.ajax({
        url: baseURL + "/",
        type: "GET"
      })
      .done(function() {
        location.assign(baseURL + "/articles");
      });
    return false;
  });

//go to saved articles page
  $("#saved-articles").on("click", function() {
    $.ajax({
        url: baseURL + "/saved",
        type: "GET"
      })
      .done(function() {
        location.assign(baseURL + "/saved");
      });
    return false;
  });

//scrape news articles
  $("#scrape").on("click", function() {
    $.ajax({
        url: baseURL + "/scrape",
        type: "GET"
      })
      .done(function() {
        location.assign(baseURL + "/articles");
      });
    return false;
  });


  //get notes
  $(".get-notes").on("click", function() {
    var articleId = $(this).data("id");
    $.ajax({
      url: baseURL + "/articles/" + articleId,
      type:"GET"
    })
    .done(function(){

    });
    return false;
  });

  //add note
  $(".add-note-button").on("click", function() {

    var articleId = $(this).data("id");

    // Get Form Data by Id
    var frmName = "form-add-" + articleId;
    var frm = $("#" + frmName);
    // AJAX Call to loaded Comment
    $.ajax({
        url: baseURL + "/articles/" + articleId,
        type: "POST",
        data: frm.serialize(),
      })
      .done(function() {
        // Refresh the Window after the call is done
        location.reload();
      });

    // Prevent Default
    return false;

  });



  //delete note
  $(".delete-note-button").on("click", function() {

    // Get _id of comment to be deleted
    var noteID = $(this).data("id");

    // AJAX Call to delete Comment
    $.ajax({
        url: baseURL + "/notes/" + noteID,
        type: "DELETE",
      })
      .done(function() {
        // Refresh the Window after the call is done
        location.reload();
      });

    // Prevent Default
    return false;

  });


});
