const express = require('express');
const passport = require('passport');
const db = require("../models");
const path = require('path');
const apiRouter = express.Router();
const request = require('request');
var _ = require('lodash');

// Get all examples
apiRouter.get("/movies", function (req, res) {
  if (req.query.s) {
    db.Movie.findOne({ where: { title: req.query.s } }).then(function (results) {
      if (results) {
        res.json(results)
      } else {
        request({ url: 'http://www.omdbapi.com/?apikey=trilogy&t=' + req.query.s }, function (err, response, body) {
          var bod = JSON.parse(body);

          request({ url: 'https://api.themoviedb.org/3/search/movie?api_key=365d042eea4b6512c2758153d858bb83&query=' + req.query.s }, function (err2, response2, body2) {
            var bod2 = JSON.parse(body2);
            var movie = bod2.results[0];
            db.Movie.create({
              title: bod.Title,
              routeName: _.camelCase(bod.Title),
              year: bod.Year,
              synopsis: movie.overview,
              languages: bod.Language,
              genres: bod.Genre,
              director: bod.Director,
              actors: bod.Actors,
              ratings: {
                imdb: parseFloat(bod.imdbRating) * 10,
                tmdb: parseFloat(movie.vote_average) * 10,
                worthit: 100
              },
              poster: 'http://image.tmdb.org/t/p/w300' + movie.poster_path
            }).then(function (results2) {
              res.json(results2);
            })
          })

        })
      }
    })
  } else {
    db.Movie.findAll().then(function (results) {
      res.json(results)
    })
  }
});

apiRouter.get("/users", function (req, res) {
  if (req.query.s) {
    db.User.findOne({ where: { id: req.query.s } }).then(function (results) {
      res.json({
        id: results.id,
        email: results.email,
        'watch list': results.watchList,
        favorites: results.favorites
      });
    })
  } else {
    db.User.findAll({}).then(function (results) {
      var viewObj = [];
      for (var i = 0; i < results.length; i++){
        var user = {
          id: results[i].id,
          email: results[i].email,
          'watch list': results[i].watchList,
          favorites: results[i].favorites
        }
      }
      res.json(results);
    });
  }
});

apiRouter.post('/users', function (req, res) {
  db.User.create(req.body)
    .then(function (results) {
      res.json(results);
    })
    .catch(function (err) {
      console.log(err, req.body);
      res.end();
    });
});

apiRouter.delete("/users/:id", function (req, res) {
  db.users.destroy({ where: { id: req.params.id } }).then(function (results) {
    res.json(results);
  });
});


module.exports = apiRouter;
