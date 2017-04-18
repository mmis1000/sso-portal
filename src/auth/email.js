var passport = require('passport')
  , crypto = require('crypto')
  , LocalStrategy = require('passport-local').Strategy;

function makeSalt() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var emailAuth = {
  name: 'email',
  strategy: 'local',
  dataSchema: {
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    uniqueSalt: { type: String, default: makeSalt() }
  },
  methods: {
    setEmailPassword: function setPassword(password) {
      this.authMethods.email.password = crypto.pbkdf2Sync(
        password, 
        this.authMethods.email.uniqueSalt, 
        4096, 
        64
      ).toString('hex');
    },
    checkEmailPassword: function checkPassword(password){
      return this.authMethods.email.password == crypto.pbkdf2Sync(
        password, 
        this.authMethods.email.uniqueSalt, 
        4096, 
        64
      ).toString('hex');
    }
  },
  strategieFactory: function (User, options) {
    return new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },function(email, password, done) {
      console.log(email, password, 'test')
      User.findOne({ "authMethods.email.email": email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (!user.checkEmailPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    });
  },
  setupRoute: function (User, router, loginCallback, ajaxCallback) {
    router.post('/',
      function(req, res, next) {
        passport.authenticate('local', loginCallback.bind(null, req, res, next))(req, res, next);
      }
    );
    router.post('/json',
      function(req, res, next) {
        passport.authenticate('local', ajaxCallback.bind(null, req, res, next))(req, res, next);
      }
    );
  }
}

module.exports = emailAuth;