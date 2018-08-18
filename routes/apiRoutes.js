const express = require('express');
const passport = require('passport');
const db = require("../models");
const apiRouter = express.Router();
const request = require('request');

  // Get all examples
  apiRouter.get("/movies", function(req, res) {
    if (req.query.s) {
      db.Movie.findOne({ where: { routeName: req.query.s } }).then(function (results) {
        if (results) {
          res.send(results)
        } else {
          request({ url: 'http://www.omdbapi.com/?apikey=trilogy&t=' + req.query.s }, function (err, response, body) {
            var bod = JSON.parse(body);
            res.json(bod);
          })
        }
      })
    } else {
      db.Movie.findAll().then(function(results){
        res.json(results)
      })
    }
  });

  apiRouter.get("/movies/:id", function(req, res) {
    db.Movie.findOne({where:{id: req.params.id}}).then(function(results) {
      res.json(results);
    });
  });
  
  apiRouter.get("/users", function(req, res) {
    db.User.findAll({}).then(function(results) {
      res.json(results);
    });
  });

  apiRouter.get("/users/:id", function(req, res) {
    db.Movie.findOne({where:{id: req.params.id}}).then(function(results) {
      res.json(results);
    });
  });
  // Create a new example
  apiRouter.post("/users", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  apiRouter.delete("/users/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
  module.exports = apiRouter;
