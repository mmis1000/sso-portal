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
      if (req.path !== '/site') {
        res.status(403).json('you are not a admin!!!')
      } else {
        next()
      }
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
  
  function normalizedUser(oldUser) {
    var user = oldUser.toSafeObject();
    user.id = user._id.toString()
    delete user._id;
    user.sites = user.sites.map(function (id) {
      return id.toString()
    })
    return user
  }
  
  middleware.get('/site', function (req, res, enxt) {
    Site.find({}).exec()
    .then(function (sites) {
      res.json(sites.map(normalizedSite))
    })
    .catch(function (err) {
      console.log(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.post('/site/add', function (req, res, enxt) {
    var site = new Site({
      name: req.body.name,
      type: req.body.type,
      entry: req.body.entry,
      domain: req.body.domain
    })
    
    site.save()
    .then(function (site) {
      res.json(normalizedSite(site));
    })
    .catch(function (err) {
      console.log(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.post('/site/remove', function (req, res, enxt) {
    Site.findOne({
      _id: req.body.id
    }).exec()
    .then(function (site) {
      if (!site) {
        return res.status(404).json("site not found");
      }
      return site.remove();
    })
    .then(function () {
      return res.json(null);
    })
    .catch(function (err) {
      console.log(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.post('/site/update', function (req, res, enxt) {
    Site.findOne({
      _id: req.body.id
    }).exec()
    .then(function (site) {
      if (!site) {
        return res.status(404).json("site not found");
      }
      
      site.name = req.body.name;
      site.type = req.body.type;
      site.entry = req.body.entry;
      site.domain = req.body.domain;
      
      return site.save();
    })
    .then(function (site) {
      return res.json(normalizedSite(site));
    })
    .catch(function (err) {
      console.log(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.get('/user', function (req, res, enx) {
    User.find({}).exec()
    .then(function (users) {
      var users = users.map(normalizedUser)
      res.json(users)
    })
    .catch(function (err) {
      console.log(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.post('/user/update', function (req, res, enx) {
    User.findOne({
      _id: req.body.id
    }).exec()
    .then(function (user) {
      if (!user) {
        console.log(new Error('500 due to user not dound'));
        return res.status(404).json("user not found");
      }
      
      console.log({
        username: req.body.username,
        sites: req.body.sites.map(function (id) {
          return mongoose.Types.ObjectId(id);
        }),
        setting: req.body.setting,
        isAdmin: req.body.isAdmin
      })
      
      return User.findByIdAndUpdate(req.body.id, {
        username: req.body.username,
        sites: req.body.sites.map(function (id) {
          return mongoose.Types.ObjectId(id);
        }),
        setting: req.body.setting,
        isAdmin: req.body.isAdmin
      }, {new: true}).exec()
    })
    .then(function (user) {
      return res.json(normalizedUser(user));
    })
    .catch(function (err) {
      console.log(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.post('/user/remove', function (req, res, enxt) {
    User.findOne({
      _id: req.body.id
    }).exec()
    .then(function (user) {
      if (!user) {
        return res.status(404).json("site not found");
      }
      return user.remove();
    })
    .then(function () {
      return res.json(null);
    })
    .catch(function (err) {
      console.log(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  return middleware;
}

module.exports = createMiddleWare