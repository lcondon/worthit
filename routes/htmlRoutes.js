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

htmlRouter.get('/movies/categories', function(req, res){
  res.render('index')
});

htmlRouter.get('/movies/lu', function(req, res){
  res.render('movie', {
    title: '',
    year: 1995,
    director: '',
    actors: '',
    synopsis: '',
    criticScore: 64,
    generalScore: 71,
    worthItScore: 99,
    poster: ''
  })
});

htmlRouter.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/../index.html"));
});

htmlRouter.post('/login',
  passport.authenticate('local', {
    successRedirect: '/favorites',
    failureRedirect: '/login',
    failureFlash: true
  })
);

htmlRouter.get("/favorites", function (req, res) {
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

// Render 404 page for any unmatched routes
// htmlRouter.get("*", function (req, res) {
//   res.render("404");
// });

module.exports = htmlRouter;

