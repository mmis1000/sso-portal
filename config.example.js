module.exports = {
  mongodbPath: "mongodb://localhost/sso",
  site: "http://sso-portal-mmis1000.c9users.io/",
  auth: {
    email: {},
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://sso-portal-mmis1000.c9users.io/api/auth/google/callback'
    },
    github: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://sso-portal-mmis1000.c9users.io/api/auth/github/callback"
    }
  }
}