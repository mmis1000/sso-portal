var passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var googleAuth = {
  name: 'google',
  strategy: 'google',
  dataSchema: {
    id: { type: String, default: '' },
    accessToken: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
    profile: {}
  },
  strategieFactory: function (User, options) {
    return new GoogleStrategy({
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({  "authMethods.google.id": profile.id }, function (err, user) {
          if (err) return done(err);
          
          user.authMethods.google = {
            id: profile.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
          }
          
          user.username = user.username || profile.displayName;
          return user.save(done);
        });
      }
    )
  }, 
  setupRoute: function (User, router, loginCallback, ajaxCallback) {
    router.get('/',
      passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login', session: true }));
    
    router.get('/callback', 
      function(req, res, next) {
        passport.authenticate('google', loginCallback.bind(null, req, res, next))(req, res, next);
      }
    );
  }
}

module.exports = googleAuth;