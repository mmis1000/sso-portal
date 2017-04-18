var Router = require('express').Router;
var passport = require('passport');
var mongoose = require('mongoose');
var Url = require('url');
var User = (require("../models/user"))(mongoose);

function createMiddleWare(app, mountPoint, config, services) {
  var middleware = new Router;
  
  app.use(passport.initialize());
  // app.use(passport.session());
  
  middleware.use(function (req, res, next) {
    next()
  })
  
  app.use(function (req, res, next) {
    if (req.session.__user__) {
      User.findById(req.session.__user__, function(err, user) {
        if (err) return res.status(500).end(err.stack);
        req.user = user
        next();
      });
    } else {
      req.user = null;
      next();
    }
  })
  
  // setup auth methods
  /*passport.serializeUser(function(user, done) {
    done(null, user._id.toString());
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  */
  
  var normalizedPath = require("path").join(__dirname, "../auth");
  
  // inject auth strategys
  var strategys = require("fs").readdirSync(normalizedPath).map(function(file) {
    return require("../auth/" + file);
  });
  
  // setup auth methods
  var options = config.auth;
  
  strategys.forEach(function (strategy) {
    var strategyInstance = strategy.strategieFactory(User, options[strategy.name]);
    passport.use(strategyInstance);
  });
  
  strategys.forEach(function (strategy) {
    
    var subMiddleware = new Router();
    middleware.use('/' + strategy.name, subMiddleware)
    
    subMiddleware.use(function (req, res, next) {
      next()
    })
    
    strategy.setupRoute(
      User, 
      subMiddleware,
      function (req, res, next, err, user, info) {
        if (err || (!user)) {
          if (!user && !info) {
            info = {message: 'verifiction failed'}
          }
          
          err = (err || info.message).toString();
          
          return res.render('auth_callback', {
            event: null,
            message: info
          });
        }
        
        req.user = user;
        req.session.__user__ = user._id.toString();
        
        res.render('auth_callback', {
          event: user.toSafeObject()
        });
      }, 
      function (req, res, next, err, user, info) {
        if (err || (!user)) {
          if (!user && !info) {
            info = {message: 'verifiction failed'}
          }
          
          err = (err || info.message).toString();
          return res.status(401).json(err);
        }
        req.user = user;
        req.session.__user__ = user._id.toString();
        
        res.json(user.toSafeObject());
      }
    );
  })
  return middleware;
}
module.exports = createMiddleWare;