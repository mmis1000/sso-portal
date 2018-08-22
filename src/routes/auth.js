var Router = require('express').Router;
var passport = require('passport');
var mongoose = require('mongoose');
var Url = require('url');
var User = (require("../models/user"))(mongoose);
var Q = require("q");

function createMiddleWare(app, mountPoint, config, services) {
  var middleware = new Router;
  
  app.use(passport.initialize());
  // app.use(passport.session());
  
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
      if (req.query.redirect) {
        req.session.redirect = req.query.redirect;
      }
      next()
    })
    
    strategy.setupRoute(
      User, 
      subMiddleware,
      function (req, res, next, err, user, info) {
        function safeStr(obj) {
          return JSON.stringify(obj).replace(/</g, '\\u003c');
        }
        
        var redirectTo = req.session.redirect;
        delete req.session.redirect;
        
        if (err || (!user)) {
          if (!user && !info) {
            info = {message: 'verifiction failed'}
          }
          
          var message = info ? info.message : null;
          message = message || err.message;
          message = message || 'buggggggg';
          
          return res.render('auth_callback', {
            user: safeStr(null),
            message: safeStr(message),
            redirect: safeStr(null)
          });
        }
        
        req.user = user;
        req.session.__user__ = user._id.toString();
        
        var waitList = []
        services.emit('login_success', req, res, next, []);
        
        Q.all(waitList).then(function () {
          res.render('auth_callback', {
            user: safeStr(user.toSafeObject()),
            message: safeStr(null),
            redirect: safeStr(redirectTo),
            sso_site: config.site
          });
        })
        
      }, 
      function (req, res, next, err, user, info) {
        delete req.session.redirect;
        
        if (err || (!user)) {
          if (!user && !info) {
            info = {message: 'verifiction failed'}
          }
          
          var message = info ? info.message : null;
          message = message || err.message;
          message = message || 'buggggggg';
          
          return res.status(401).json(message);
        }
        
        req.user = user;
        req.session.__user__ = user._id.toString();
        
        var waitList = []
        services.emit('login_success', req, res, next, []);
        
        Q.all(waitList).then(function () {
          res.json(user.toSafeObject());
        })
      }
    );
  })
  
  middleware.post('/logout', function (req, res) {
    delete req.session.__user__;
    res.status(200).jsonp(null);
  })
  
  middleware.get('/login_status', function (req, res) {
    if (!req.user) {
      return res.status(401).jsonp(null);
    }
    res.status(200).jsonp(req.session.user);
  })
  
  return middleware;
}
module.exports = createMiddleWare;