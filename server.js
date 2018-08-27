require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var bars = require("express-handlebars");
var passport = require('passport');
var Handlebars = require('handlebars');

var db = require("./models");
var PORT = process.env.PORT || 8800;

var apiRouter = require("./routes/apiRoutes");
var htmlRouter = require("./routes/htmlRoutes");

var app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public/assets"));
app.use(bodyParser.urlencoded({ extended: true }));
require('./config/passport')(app);
// Handlebars
app.engine("handlebars", bars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://radiant-anchorage-14785.herokuapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Routes
app.use('/api', apiRouter);
app.use('/', htmlRouter);

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

//Handles Results Numbers
Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
  });
});

module.exports = app;
