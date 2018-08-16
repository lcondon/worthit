require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var bars = require("express-handlebars");
var passport = require('passport');

var _ = require('lodash');
var moment = require('moment');
moment().format();

var db = require("./models");
var PORT = process.env.PORT || 8800;

var apiRouter = require("./routes/apiRoutes");
var htmlRouter = require("./routes/htmlRoutes");

var app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
require('./config/passport')(app);
// Handlebars
app.engine("handlebars", bars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Routes
app.use('/', htmlRouter);
app.use('/api', apiRouter);

var syncOptions = { force: true };


db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
  });
});

module.exports = app;
