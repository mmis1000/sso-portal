var Router = require('express').Router;
var mongoose = require('mongoose');
var User = (require("../models/user"))(mongoose);
var Q = require("q");
var Sso_session = (require("../models/sso_session"))(mongoose);
var Url = require("url")

function makeid(length) {
  length = length || 16
  
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i = 0; i < length; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

function createMiddleWare(app, mountPoint, config, services) {
  var middleware = new Router;
  
  function getNewSession(site) {
    var session = new Sso_session({
      site: site,
      token: makeid(64),
      session: makeid(64),
      user: null
    })
    
    return session.save().then(function(doc) {
      return doc;
    })
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
  
  function sameDomain(siteA, siteB) {
    var parsedA = Url.parse(siteA);
    var parsedB = Url.parse(siteB);
    return parsedA.protocol === parsedB.protocol && parsedA.host === parsedB.host;
  }
  
  app.use("/Login", function (req, res, next) {
    var token, site_id;
    req.session.sso_token = req.session.sso_token || {}
    if (req.query.site && req.session.sso_token[req.query.site]) {
      site_id = req.query.site
      token = req.session.sso_token[req.query.site]
      
      req.session.loginFor = site_id;
      
      Sso_session.findOne({
        token: token
      })
      .populate("site")
      .then(function (session) {
        if (!session) {
          res.messages.push({
            type: "error",
            text: "unknown token",
            redirect: "/Login"
          })
          throw "";
        }
        
        if (req.query.redirect !== session.site.entry) {
          res.messages.push({
            type: "error",
            text: "invalid redirect path",
            redirect: "/Login"
          })
          throw "bad"
        }
        
        if (req.user) {
          if (checkAccess(req.user, session.site._id)) {
            return bindSession(session, req.user)
          } else {
            res.messages.push({
              type: "error",
              text: "You don't have access to this site.",
              redirect: "/Login"
            })
            throw "bad"
          }
        } else {
          throw "";
        }
      })
      .then(function (session) {
        res.redirect(req.query.redirect);
      })
      .catch(function (message) {
        if (message === "bad") {
          Sso_session
          .deleteMany({_id: token})
          .catch(() => {});
          delete req.session.sso_token[site_id];
        }
        if (message !== 'resolved') {
          next();
        }
      })
    } else {
      next();
    }
  })
  
  services.on('login_success', function(req, res, next, waitList) {
    req.session.sso_token = req.session.sso_token || {}
    waitList.push(new Promise((resolve, reject)=>{
      if (!req.session.loginFor) {
        return resolve();
      }
      
      if (!req.session.sso_token[req.session.loginFor]) {
        return resolve();
      }
      
      var token = req.session.sso_token[req.session.loginFor];
      delete req.session.loginFor;
      delete req.session.sso_token[req.session.loginFor];
      
      Sso_session.findOne({
        token: token
      })
      .then(function (session) {
        if (!session) {
          return resolve();
        } else if (!checkAccess(req.user, session.site)) {
          return resolve();
        } else {
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
    if (req.headers['x-original-uri'] === "/favicon.ico") {
      res.header('sso_session', req.cookies.sso_session)
      return res.end('ok')
    }
    
    req.session.sso_token = req.session.sso_token || {}
    getSession(req.params.site, req.cookies.sso_session)
    .then((session)=>{
      return Sso_session.populate(session, {path:"user"})
    })
    .then((session)=>{
      if (!session.user) {
        return [
          session.save(),
          Promise.resolve(false)
        ]
      } else if (checkAccess(session.user, session.site)) {
        return [
          session.save(), 
          Promise.resolve(true)
        ]
      } else {
        console.log(session.toObject());
        return [
          session
            .remove()
            .then(()=>getNewSession(req.params.site)), 
          Promise.resolve(false)
        ]
      }
    })
    .spread(function (session, haveAccess) {
      console.log('do response')
      if (!haveAccess) {
        res.status(401);
      }
      // console.log('Updating session cookie to ' + session.session)
      // console.log('Sending session token ' + session.token)
      res.header("sso-session", session.session);
      res.header("sso-login-token", session.token);
      res.end(haveAccess ? 'allow': 'denied')
    })
    .catch(function (err) {
      console.error(err.stack);
      res.status(500).json(err.toString());
    })
  })
  
  middleware.get('/secure_redirect/:site', function (req, res, next) {
    function safeStr(obj) {
      return JSON.stringify(obj).replace(/</g, '\\u003c');
    }
    res.render('secure_redirect.html', {
      sso_site: config.site,
      site: safeStr(req.params.site),
      sso_token: safeStr(req.query.sso_token),
      redirect: safeStr(req.query.redirect),
      endpoint: safeStr(config.site + mountPoint + '/secure_redirect_to/' + req.params.site)
    })
  })
  
  middleware.post('/secure_redirect_to/:site', function (req, res, next) {
    req.session.sso_token = req.session.sso_token || {};
    Sso_session.findOne({token: req.body.sso_token})
    .populate("site")
    .then((session)=>{
      if (!session) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        return res.json({
          redirect: null
        });
      };
      
      var origin = req.headers.origin;
      var expect = session.site.domain
      if (sameDomain(origin, expect)) {
        req.session.sso_token[session.site._id.toString()] = req.body.sso_token;
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', session.site.domain);
        return res.json({
          redirect: `${config.site}/Login?site=${session.site._id.toString()}&redirect=${req.body.redirect}`
        })
      } else {
        return res.status(403).end('forbidden, origin disallowed')
      }
    })
    .catch(function (err) {
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', '*');
      res.status(500).end(err.stack);
    })
  })
  return middleware
}

module.exports =  createMiddleWare
