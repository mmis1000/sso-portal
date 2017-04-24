var passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy;

var githubAuth = {
  name: 'github',
  strategy: 'github',
  dataSchema: {
    id: { type: String, default: '' },
    accessToken: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
    profile: {}
  },
  strategieFactory: function (User, options) {
    return new GitHubStrategy({
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ "authMethods.github.id": profile.id }, function (err, user) {
          if (err) return done(err);
          
          user.authMethods.github = {
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
      passport.authenticate('github', { session: true}));
    
    router.get('/callback', 
      function(req, res, next) {
        passport.authenticate('github', loginCallback.bind(null, req, res, next))(req, res, next);
      }
    );
  }
}

module.exports = githubAuth;