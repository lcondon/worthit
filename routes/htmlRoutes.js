const express = require('express');
const passport = require('passport');
const db = require("../models");
const path = require('path');
const htmlRouter = express.Router();
const request = require('request');

// Load index page
htmlRouter.get(["/", '/home', '/index'], function (req, res) {
  res.sendFile(path.join(__dirname + "/../index.html"));
});

htmlRouter.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/../index.html"));
});

htmlRouter.post('/login',
  passport.authenticate('local', {
    successRedirect: '/gotem',
    failureRedirect: '/shots',
    failureFlash: true
  })
);

htmlRouter.post('/signup', function (req, res) {
  db.User.create(req.body)
    .then(function () {
      res.redirect('/gotem')
    })
    .catch(function (err) {
      console.log(err, req.body);
      res.end();
    });
});

htmlRouter.get("/gotem", function (req, res) {
  // db.Example.findAll({}).then(function (dbExamples) {
  //   res.render("index", {
  //     msg: "Welcome!",
  //     examples: dbExamples
  //   });
  // });
  res.send(":)");
});

htmlRouter.get('/auth', function (req, res) {
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    res.redirect('/')
  }
})

htmlRouter.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// Load example page and pass in an example by id
htmlRouter.post("/movies/:title", function (req, res) {
  db.Movie.findOne({ where: { routeName: req.params.title } }).then(function (results) {
    if (results) {
      res.send(results)
    } else {
      request({ url: 'http://www.omdbapi.com/?apikey=trilogy&t=' + req.body.title }, function (err, response, body) {
        var bod = JSON.parse(body);
        res.send(bod);
      })
    }
  })
});

htmlRouter.get("/movies", function (req, res) {

});



// Render 404 page for any unmatched routes
// htmlRouter.get("*", function (req, res) {
//   res.render("404");
// });

module.exports = htmlRouter;
