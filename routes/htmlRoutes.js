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
    var options = { $like: '%' + req.query.s + '%' };
    db.Movie.findOne({ where: { title: options } }).then(function (result) {

      var theMovie = result.dataValues;
      console.log(theMovie)
      db.Rating.findAll({ where: { movie_id: result.id }, order: [['createdAt', 'DESC']] }).then(function (comments) {
        var comments = comments;
        if (comments.length > 0) {
          var totalRatings = comments.length;
          var worthItRatings = 0;
          for (var i = 0; i < totalRatings; i++) {
            if (comments[i].rating == true) {
              worthItRatings++;
              comments[i].rating = 'WorthIt'
            } else {
              comments[i].rating = 'Not WorthIt'
            }
          }
          var userRating = parseInt((worthItRatings / totalRatings) * 100) || 0;
          db.Movie.update({
            differential: userRating - result.ratings.critic || result.ratings.general - result.ratings.critic || 0,
            ratings: {
              critic: result.ratings.critic,
              general: result.ratings.general,
              worthit: userRating
            }
          }, {
              where: {
                id: result.id
              }
            }).then(function (data) {
              res.render('movie', {
                movies: { info: theMovie, comments: comments }
              })
            }).catch(function (err) {
              res.json(false)
            })
        } else {
          res.render('movieNoComment', {
            movies: { info: theMovie }
          })
        }

      }).catch(function (err) {
        res.render('movieNoComment', {
          movies: { info: theMovie }
        })
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
      movies: {
        results: result,
        color: 'movieColorBad',
        pageTitle: 'Not WorthIt'
      }
    })
  })
})

htmlRouter.get('/movies/worthit', function (req, res) {
  db.Movie.findAll({
    limit: 10,
    order: [['differential', 'DESC']]
  }).then(function (result) {
    res.render('results', {
      movies: {
        results: result,
        color: 'movieColorGood',
        pageTitle: 'WorthIt'
      }
    })
  })
})

htmlRouter.get('/movies/categories', function (req, res) {
  res.render('categories');
});

htmlRouter.get('/movies/categories/:category', function (req, res) {
  db.Movie.findAll({ where: { genres: { $like: "%" + req.params.category + "%" } } }).then(function (movies) {
    res.render('results', {
      movies: {
        results: movies,
        color: 'movieColorNeutral',
        pageTitle: req.params.category
      }
    });
  });
})

htmlRouter.get("/login", function (req, res) {
  res.render('login')
});

htmlRouter.post('/login',
  passport.authenticate('local'), function (req, res) {
    if (req.isAuthenticated()) {
      res.json({ redirect: '/movies/favorites' })
    } else {
      res.json({ redirect: '/login' })
    }
  }
);

htmlRouter.get("/movies/favorites", function (req, res) {
  if (req.isAuthenticated()) {
    var favorites = JSON.parse(req.user.dataValues.favorites)
    db.Movie.findAll({
      where:
      {
        id: { [db.Sequelize.Op.or]: favorites }
      }
    }).then(function (results) {
      res.render("results", {
        movies: {
          results: results,
          color: 'movieColorNeutral',
          pageTitle: 'Your favorites'
        }
      });
    });
  } else {
    res.render('error', {
      message: 'You must be logged in to visit your favorites!'
    })
  }
});

htmlRouter.get('/auth', function (req, res) {
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    res.redirect('/')
  }
})

htmlRouter.get('/error', function (req, res) {
  res.render('error')
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

