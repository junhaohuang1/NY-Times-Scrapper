// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    //Adding unique so that only one of each title will show up
    unique: true
  },
  // link is a required string
  link: {
    type: String,
    required: true,
    //Making the link unique so that only one of each link will show up.
    unique: true
  },
  saved:{
    type: Boolean,
    default: false,
    required: true
  },

  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});


var Article = mongoose.model("Article", ArticleSchema);

// Export
module.exports = Article;
