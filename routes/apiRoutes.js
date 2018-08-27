const express = require('express');
const passport = require('passport');
const db = require("../models");
const path = require('path');
const apiRouter = express.Router();
const request = require('request');
var _ = require('lodash');
var moment = require('moment');

// Get all examples
apiRouter.get('/movies', function (req, res) {
  if (req.query.s) {
    var options = { $like: '%' + req.query.s + '%' };
    db.Movie.findOne({
      where: {
        title:
          options
      }
    }).then(function (results) {
      res.json({ redirect: '/movies?s=' + results.dataValues.title })

    }).catch(function (err) {
      res.json(false)
    })
  } else {
    db.Movie.findAll().then(function (results) {
      res.json(results)
    })
  }
});

apiRouter.post('/movies', function (req, res) {
  if (req.query.s) {
    request({ url: 'http://www.omdbapi.com/?apikey=trilogy&t=' + req.query.s }, function (err, response, body) {
      var body1 = JSON.parse(body);
      if (body1.Error) {
        res.json(false);
      } else {
        var movie = {
          title: body1.Title,
          routeName: _.camelCase(body1.Title) + body1.Year,
          year: body1.Year,
          synopsis: body1.Plot,
          languages: body1.Language,
          genres: body1.Genre,
          director: body1.Director,
          actors: body1.Actors,
          ratings: {
            critic: body1.Metascore || 0,
            general: parseFloat(body1.imdbRating) * 10 || 0,
            worthit: null
          },
          differential: parseFloat(body1.imdbRating) * 10 - parseFloat(body1.Metascore) || 0,
          poster: body1.Poster
        }
        var regex = /'/gi;
        var url = body1.Title.replace(regex, '%27');
        var outString = url.replace(/[`~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/g, '');
        var urlTitle = _.split(outString, " ").join('-');
        var options = {
          url: 'https://api-marcalencc-metacritic-v1.p.mashape.com/movie/' + urlTitle,
          headers: {
            "X-Mashape-Key": "TEDXKda4HhmshcRPSLhtT4fsBVEdp1NvVg8jsnrhla0zm1qdCb",
            "Accept": "application/json"
          }
        };
        request(options, function (err2, response2, metaBody) {
          var body2 = JSON.parse(metaBody);
          if (body2[0].Rating) {
            movie.ratings.critic = body2[0].Rating.CriticRating;
            movie.ratings.general = parseFloat(body2[0].Rating.UserRating) * 10;
            movie.differential = parseFloat(body2[0].Rating.UserRating) * 10 - parseFloat(body2[0].Rating.CriticRating) || 0;
          }
          if (movie.poster == 'N/A') {
            movie.poster = '/images/movieplaceholder.gif';
          }

          db.Movie.create(movie).then(function (results2) {
            res.send({ redirect: '/movies?s=' + results2.title });
          }).catch(function (err) {
            res.json(false)
          })
        })
      }
    })
  } else {
    db.Movie.findAll().then(function (results) {
      res.send(results)
    })
  }
})

apiRouter.post('/ratings', function (req, res) {
  if (req.isAuthenticated()) {
    db.Rating.findOrCreate({
      where: {
        user_id: req.user.dataValues.id,
        movie_id: req.body.movie_id
      }, defaults: { rating: req.body.rating, comment: req.body.comment }
    }).then(function (query) {
      console.log(query)
      db.Rating.update(
        {
          rating: req.body.rating,
          comment: req.body.comment

        }, {
          where: {
            user_id: req.user.dataValues.id,
            movie_id: req.body.movie_id
          }
        }).then(function (result) {
          res.json(result)
        })
    })

  } else {
    res.json(false)
  }
})

apiRouter.put('/ratings', function (req, res) {
  if (req.isAuthenticated()) {
    db.Rating.update({
      comment: req.body.comment
    }, {
        where: {
          user_id: req.user.dataValues.id
        }
      }).then(function (result) {
        res.json(result)
      })
  } else {
    res.json(false)
  }
})

apiRouter.get('/users', function (req, res) {
  if (req.query.s) {
    db.User.findOne({ where: { id: req.query.s } }).then(function (results) {
      res.json({
        id: results.id,
        name: results.name,
        email: results.email,
        'watch list': results.watchList,
        favorites: results.favorites,
        createdAt: results.createdAt,
        updatedAt: results.updatedAt
      });
    })
  } else {
    db.User.findAll({}).then(function (results) {
      var viewObj = [];
      for (var i = 0; i < results.length; i++) {
        var user = {
          id: results[i].id,
          name: results[i].name,
          email: results[i].email,
          'watch list': results[i].watchList,
          favorites: results[i].favorites,
          createdAt: results[i].createdAt,
          updatedAt: results[i].updatedAt
        }
        viewObj.push(user);
      }
      res.json(viewObj);
    });
  }
});

apiRouter.post('/users', function (req, res) {
  db.User.create(req.body)
    .then(function (results) {
      res.json(results);
    })
    .catch(function (err) {
      res.json(false);
    });
});

apiRouter.put('/users', function (req, res) {
  if (req.isAuthenticated()) {
    db.User.findOne({ where: { id: req.user.dataValues.id } }).then(function (results) {
      var favoriteValue = results.dataValues.favorites;
      console.log(req)
      if (favoriteValue == null) {
        db.User.update({
          favorites: "[" + req.body.movieId + "]"
        }, {
            where: {
              id: req.user.dataValues.id
            }
          })
      } else {
        favoriteValue = JSON.parse(favoriteValue)
        if (favoriteValue.indexOf(req.body.movieId) < 0) {
          favoriteValue.push(req.body.movieId)
        }
        db.User.update({
          favorites: JSON.stringify(favoriteValue)
        }, {
            where: {
              id: req.user.dataValues.id
            }
          }).then(res.json(true))
      }

    })
  } else {
    res.json(false)
  }
})

apiRouter.delete('/users/:id', function (req, res) {
  db.users.destroy({ where: { id: req.params.id } }).then(function (results) {
    res.json(results);
  });
});



module.exports = apiRouter;