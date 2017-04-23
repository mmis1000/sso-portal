var Router = require('express').Router;
var passport = require('passport');
var mongoose = require('mongoose');
var Url = require('url');
var User = (require("../models/user"))(mongoose);
var Site = (require("../models/site"))(mongoose);

function createMiddleWare(app, mountPoint, config, services) {
  var middleware = new Router
  middleware.use((req, res, next)=>{
    if (!req.user || !req.user.isAdmin) {
      res.status(403).json('you are not a admin!!!')
    } else {
      next()
    }
  })
  
  function normalizedSite(oldSite) {
    var site = oldSite.toObject();
    site.id = site._id.toString()
    delete site._id;
    return site
  }
  
  middleware.get('/site', function (req, res, enxt) {
    Site.find({}).exec()
    .then(function (sites) {
      res.json(sites.map(normalizedSite))
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.post('/site/add', function (req, res, enxt) {
    var site = new Site({
      name: req.body.name,
      type: req.body.type
    })
    
    site.save()
    .then(function (site) {
      res.json(normalizedSite(site));
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.post('/site/remove', function (req, res, enxt) {
    Site.findOne({
      _id: req.body.id
    }).exec()
    .then(function (site) {
      if (!site) {
        return res.status(500).json("site not found");
      }
      return site.remove();
    })
    .then(function () {
      return res.json(null);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.post('/site/update', function (req, res, enxt) {
    Site.findOne({
      _id: req.body.id
    }).exec()
    .then(function (site) {
      if (!site) {
        return res.status(500).json("site not found");
      }
      
      site.name = req.body.name;
      site.type = req.body.type;
      
      return site.save();
    })
    .then(function (site) {
      return res.json(normalizedSite(site));
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.get('/user', function (req, res, enx) {
    User.find({}).exec()
    .then(function (users) {
      var users = users.map(function (user) {
        user = user.toSafeObject();
        user.id = user._id.toString();
        delete user._id;
        user.sites = user.sites.map(function function_name(id) {
          return id.toString()
        })
        return user;
      })
      res.json(users)
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.get('/user/:id', function (req, res, enx) {
    
  })
  
  return middleware;
}

module.exports = createMiddleWare