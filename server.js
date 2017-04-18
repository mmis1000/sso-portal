var swig  = require('swig');
var React = require('react');
import { StaticRouter } from "react-router";
import { renderToString } from "react-dom/server";
var alt = require('./app/alt');
var Q = require('q');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.Promise = Q.Promise;

var routes = require('./app/routes');
var config = require('./config');

var app = express();

mongoose.connect(config.mongodbPath)

app.set('port', process.env.PORT || 8080);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'wow, much secret'}));

app.post('/api/login_status', function (req, res) {
  if (!req.session.user) {
    res.status(401);
  }
  res.status(200).jsonp(req.session.user);
})

app.post('/api/login/email', function (req, res) {
  console.log(req.body);
  if (req.body.password !== 'test') {
    return res.status(401).jsonp(null);
  }
  var user = req.session.user = {
    username: req.body.email,
  }
  res.status(200).jsonp(user);
  // res.status(200).jsonp({username: 'mmis1000'});
})

app.post('/api/logout', function (req, res) {
  req.session.user = null;
  res.status(200).jsonp(null);
  // res.status(200).jsonp({username: 'mmis1000'});
})

var authRoute = require("./src/routes/auth")(app, '/api/auth', config);
app.use('/api/auth', authRoute)

app.use('/api', function (req, res) {
  res.status(404).end('api not found')
})


app.use(function(req, res) {
  const context = {};
    
  alt.getActions('AppActions').pathChange(req.path)
  // alt.getActions('AppActions').loginStatusSuccess({username: 'mmis1000'})
  if (req.user) {
    alt.getActions('AppActions').loginStatusSuccess(req.user.toSafeObject())
  } else {
    alt.getActions('AppActions').loginStatusFail(null)
  }
  
  var snapshot = JSON.stringify(alt.takeSnapshot());
  
  const html = renderToString(
    <StaticRouter location={req.url} context={context}>
      {routes}
    </StaticRouter>
  );
  
  
  const page = swig.renderFile('views/index.html', { html, snapshot });
  
  res.status(200).send(page);
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});