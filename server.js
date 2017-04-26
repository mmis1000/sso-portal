var swig  = require('swig');
var React = require('react');
import { StaticRouter } from "react-router";
import { renderToString } from "react-dom/server";
var alt = require('./app/alt');
var Q = require('q');
var EventEmitter = require('events').EventEmitter

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var mongoose = require('mongoose');
mongoose.Promise = Q.Promise;

var routes = require('./app/routes');
var config = require('./config');

var app = express();

mongoose.connect(config.mongodbPath)

app.set('port', config.port);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(config.sessionSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: true,
  secret: config.sessionSecret,
  store: new MongoStore({ url: config.mongodbPath })
}));

var services = new EventEmitter;

app.use(function(req, res, next) {
    res.messages = [];
    next();
})

var authRoute = require("./src/routes/auth")(app, '/api/auth', config, services);
app.use('/api/auth', authRoute)

var adminRoute = require("./src/routes/admin")(app, '/api/admin', config, services);
app.use('/api/admin', adminRoute)

var ssoRoute = require("./src/routes/sso")(app, '/api/sso', config, services);
app.use('/api/sso', ssoRoute)

app.use('/api', function (req, res) {
  res.status(404).end('api not found')
})

var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./mongo_express_config');

(function (mongo_express_config) {
  var URL = require('url');
  var temp = URL.parse(config.mongodbPath);
  
  if ((/\/\/[^\/,]+,[^\/,]+[^\/]+\//).test(config.mongodbPath)) {
    var pathes = (/\/\/([^\/,]+,[^\/,]+[^\/]+)\//).exec(config.mongodbPath)[1].split(/,/g);
    
    mongo_express_config.mongodb.server = pathes.map(function (str) {
      var temp = str.split(':');
      mongo_express_config.mongodb.port = parseInt(temp[1]) || mongo_express_config.mongodb.port
      return temp[0]
    })
    
    mongo_express_config.mongodb.port = mongo_express_config.mongodb.port || 27017;
  } else {
    mongo_express_config.mongodb.server = temp.hostname;
    mongo_express_config.mongodb.port = parseInt(temp.port) || 27017;
  }
  
  console.log('current mongo_express db setting')
  console.log(JSON.stringify(mongo_express_config.mongodb.server, 0, 4))
  console.log(JSON.stringify(mongo_express_config.mongodb.port, 0, 4))
  
  if (temp.auth) {
    mongo_express_config.mongodb.auth.push({
      database: temp.pathname.replace(/^\//, ''),
      username: temp.auth.split(':')[0],
      password: decodeURIComponent(temp.auth.split(':').slice(1).join(':'))
    })
  }
  
  mongo_express_config.basicAuth.username = config.dbManagerAccount
  mongo_express_config.basicAuth.password = config.dbManagerPassword
   
} (mongo_express_config));

if (config.enableDbManager) {
  app.use(config.dbManagerPath, mongo_express(mongo_express_config))
}

app.use(function(req, res) {
  const context = {};
    
  // alt.getActions('AppActions').loginStatusSuccess({username: 'mmis1000'})
  if (req.user) {
    alt.getActions('AppActions').loginStatusSuccess(req.user.toSafeObject())
  } else {
    alt.getActions('AppActions').loginStatusFail(null);
  }
  
  alt.getActions('AppActions').pathChange(req.path);
  alt.getActions('AppActions').searchChange(req.query);
  alt.getActions('AppActions').setDomain(config.site);
  alt.getActions('AppActions').addMessages(res.messages);
  // console.log(res.messages)
  var snapshot = JSON.stringify(alt.takeSnapshot()).replace(/</g, '\\u003c');;
  // console.log(snapshot)
  
  
  const html = renderToString(
    <StaticRouter location={req.url} context={context}>
      {routes}
    </StaticRouter>
  );
  
  alt.flush();
  
  
  const page = swig.renderFile('views/index.html', { html, snapshot });
  
  res.status(200).send(page);
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});