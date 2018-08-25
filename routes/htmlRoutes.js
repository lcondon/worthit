const express = require('express');
const passport = require('passport');
const db = require("../models");
const path = require('path');
const htmlRouter = express.Router();
var _ = require('lodash');
const request = require('request');

// Load index page
htmlRouter.get(["/", '/home', '/index'], function (req, res) {
  var obj = {}
  if (req.isAuthenticated()) {
    obj.image = ''
  } else {
    obj.image = '/images/plus.png'
  }
  res.render('index', obj)
});

htmlRouter.get('/movies', function (req, res) {
  if (req.query.s) {
    var options = { $like: '%' + req.query.s };
    db.Movie.findOne({ where: { title: options } }).then(function (result) {
      res.render('movie', {
        movie: result
      })
    }).catch(function (err) {
      res.json(false)
    })
  } else {
    res.json(false);
  }
});


htmlRouter.get('/movies/notworthit', function (req, res) {
  db.Movie.findAll({ limit: 10, order: [['differential', 'ASC']] }).then(function (result) {
    res.render('results', { 
      movies: {results: result,
        color: 'movieColorBad',
        pageTitle: 'Not WorthIt' }})
  })
})

htmlRouter.get('/movies/worthit', function (req, res) {
  db.Movie.findAll({
    limit: 10,
    order: [['differential', 'DESC']]
  }).then(function (result) {
    res.render('results', { 
      movies: {results: result,
        color: 'movieColorGood',
        pageTitle: 'WorthIt' }})
  })
})

htmlRouter.get('/movies/categories', function (req, res) {
  res.render('categories');
});

htmlRouter.get('/movies/categories/:category', function (req, res) {
  db.Movie.findAll({ where: { genres: { $like: "%" + req.params.category + "%" } } }).then(function (movies) {
    res.render('results', { 
      movies: {results: movies,
        color: 'movieColorNeutral',
      pageTitle: req.params.category }});
  });
})

htmlRouter.get("/login", function (req, res) {
  res.render('login')
});

htmlRouter.post('/login',
  passport.authenticate('local'), function (req, res) {
    if (req.isAuthenticated()) {
      res.json({ redirect: '/movies/categories' })
    } else {
      res.json({ redirect: '/login' })
    }
  }
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

