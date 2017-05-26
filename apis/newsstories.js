var express = require('express');
var async = require('async');
var router = express.Router();

var NewsStories = require('../models').NewsStories;
var Sequelize = require('sequelize');

function getNewsStories(req, res, next){
  var news = NewsStories.findAll()
  .then(function(data){
    req.data = data;
    next();
  }).catch(function(){
    res.status(404).send({ message: 'Stories not found.' });
  })
}

function getSingleNewsStory(req, res, next){
  var news = NewsStories.findOne({
    where: {
      id: req.params.storyid
    }
  }).then(function(result){
    req.data = result;
    console.log(req.data);
    next();
  }).catch(function(){
    res.status(404).send({ message: 'Story not found.' });
  })
}

router
  .get('/getnewsstories/', getNewsStories, function(req, res, next){
    let data = req.data;
    res.send(data);
  })
  .get('/getsinglenewsstory/:storyid/', getSingleNewsStory, function(req, res, next){
    let data = req.data;
    res.send(data);
  })

module.exports = router;
