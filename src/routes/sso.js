var Router = require('express').Router;
var mongoose = require('mongoose');
var User = (require("../models/user"))(mongoose);
var Q = require("q");
var Sso_session = (require("../models/sso_session"))(mongoose);

function makeid(length) {
  length = length || 16
  
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 16; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

function createMiddleWare(app, mountPoint, config, services) {
  var middleware = new Router;
  
  function getNewSession(site) {
    var session = new Sso_session({
      site: site,
      token: makeid(32),
      session: makeid(32),
      user: null
    })
    
    return session.save()
  }
  
  function getSession(site, session_key) {
    if (!session_key) {
      return getNewSession(site)
    }
    
    return Sso_session.findOne({
      site: site, 
      session: session_key
    })
    .then((session)=>{
      if (session) {
        return session
      }
      return getNewSession(site)
    })
  }
  
  function bindSession(session, user) {
    session.token = "";
    session.user = user._id;
    return session.save()
  }
  
  function checkAccess(user, site_id) {
    if (!user) {
      return false;
    }
    
    return user.sites.reduce((prev, curr)=>{
      var equal = curr.toString() === site_id.toString()
      return prev || equal
    }, false)
  }
  
  app.use(function (req, res, next) {
    if (req.query.sso_token) {
      req.session.sso_token = req.query.sso_token
    }
    next();
  })
  
  services.on('login_success', function(req, res, next, waitList) {
    waitList.push(new Promise((resolve, reject)=>{
      if (!req.session.sso_token) {
        return resolve();
      }
      
      Sso_session.findOne({
        token: req.session.sso_token
      })
      .then(function (session) {
        if (!session) {
          return resolve();
        } else if (!checkAccess(req.user, session.site)) {
          return resolve();
        } else {
          delete req.session.sso_token
          return bindSession(session, req.user)
        }
      })
      .then(function (session) {
        if (session) {
          return resolve();
        }
      })
      .catch(function (err) {
        console.error(err.stack);
        reject();
      })
    }))
  })

  middleware.get('/check/:site', function (req, res, next) {
    getSession(req.params.site, req.cookies.sso_session)
    .then((session)=>{
      return Sso_session.populate(session, {path:"user"})
    })
    .then((session)=>{
      if (checkAccess(session.user, session.site)) {
        return [
          session.save(), 
          Promise.resolve(true)
        ]
      } else {
        return [
          session
            .remove()
            .then(()=>
              getNewSession(req.params.site)), 
          Promise.resolve(false)
        ]
      }
    })
    .spread(function (session, haveAccess) {
      if (!haveAccess) {
        res.status(401);
      }
      res.header("sso-session", session.session);
      res.header("sso-login-token", session.token);
      res.end(haveAccess ? 'allow': 'denied')
    })
    .catch(function (err) {
      console.error(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  return middleware
}

module.exports =  createMiddleWare