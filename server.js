require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require('passport')
var bars = require("express-handlebars");
var _ = require('lodash');

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

require('./config/passport')(passport);

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({ secret: "lucaslovescats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
// Handlebars
app.engine("handlebars", bars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app, passport);
require("./routes/htmlRoutes")(app, passport);

var syncOptions = { force: false };

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
  });
});

module.exports = app;
