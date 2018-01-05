//Dependencies
var express = require('express');
var router = express.Router();
var cheerio = require('cheerio'); // for web-scraping
var path = require('path');
var request = require('request'); // for web-scraping
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();

//body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
