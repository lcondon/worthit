const express = require('express');
const passport = require('passport');
const db = require("../models");
const htmlRouter = express.Router();

  // Load index page
  htmlRouter.get("/", function (req, res) {
    res.send("u did it");
  });

  htmlRouter.get("/login", function (req, res) {
    res.send("nope try again");
  });
  
  htmlRouter.post('/login', 
    passport.authenticate('local', {
      successRedirect: '/gotem',
      failureRedirect: '/shots',
      failureFlash: true
    })
  );

  htmlRouter.post('/signup', function(req, res){
    db.User.create(req.body)
    .then(function(){
      res.redirect('/gotem')
    })
    .catch(function(err) {
      console.log(err, req.body);
      res.end();
  });
  });

  htmlRouter.get("/shots", function (req, res) {

    res.send(":(");
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

  htmlRouter.get('/auth', function(req, res){
    console.log(`User authenticated? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {
      res.send('you hit the authentication endpoint\n')
    } else {
      res.redirect('/')
    }
  })

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  // Load example page and pass in an example by id
  htmlRouter.get("/movies/:id", function (req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function (dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  htmlRouter.get("*", function (req, res) {
    res.render("404");
  });

  module.exports = htmlRouter;
