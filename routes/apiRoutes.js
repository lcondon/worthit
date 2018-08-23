const express = require('express');
const passport = require('passport');
const db = require("../models");
const path = require('path');
const apiRouter = express.Router();
const request = require('request');
var _ = require('lodash');
var moment = require('moment');

// Get all examples
apiRouter.get("/movies", function (req, res) {
  if (req.query.s) {
    db.Movie.findOne({ where: { routeName: _.camelCase(req.query.s) } }).then(function (results) {
      if (results) {
        res.json(results)
      } else {
        res.json(false)
      }
    })
  } else {
    db.Movie.findAll().then(function (results) {
      res.json(results)
    })
  }
});

apiRouter.post('/movies', function (req, res) {
  if (req.query.s) {
    db.Movie.findOne({ where: { routeName: _.camelCase(req.query.s) } }).then(function (results) {
      if (results) {
        res.json(results)
      } else {
        request({ url: 'http://www.omdbapi.com/?apikey=trilogy&t=' + req.query.s }, function (err, response, body) {
          var body1 = JSON.parse(body);
          if (body1.Error) {
            res.json(false);
          }
          var urlTitle = _.split(body1.Title, " ").join('-');
          var options = {
            url: 'https://api-marcalencc-metacritic-v1.p.mashape.com/movie/' + urlTitle,
            headers: {
              "X-Mashape-Key": "TEDXKda4HhmshcRPSLhtT4fsBVEdp1NvVg8jsnrhla0zm1qdCb",
              "Accept": "application/json"
            }
          };
          request(options, function (err2, response2, metaBody) {
            var body2 = JSON.parse(metaBody);
            console.log(body2);
            body2 = body2[0];
            if (body2.Message) {
              res.json(false)
            }
            db.Movie.create({
              title: body1.Title,
              routeName: _.camelCase(body1.Title),
              year: body1.Year,
              synopsis: body1.Plot,
              languages: body1.Language,
              genres: body1.Genre,
              director: body1.Director,
              actors: body1.Actors,
              ratings: {
                critic: body2.Rating.CriticRating,
                general: parseFloat(body2.Rating.UserRating) * 10,
                worthit: 100
              },
              poster: body1.Poster
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
})

apiRouter.get("/users", function (req, res) {
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