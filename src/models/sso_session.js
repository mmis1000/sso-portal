var findOrCreate = require('mongoose-findorcreate');

var SsoSessionFactory = function (mongoose) {
  var ssoSessionSchema = new mongoose.Schema({
    site: {type: mongoose.Schema.ObjectId, ref: 'Site'},
    session: { type: String, default: '' },
    token: { type: String, default: '' },
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    createdAt: {type: Date},
    updatedAt: {type: Date, expires: 3600 * 24}
  });
  
  ssoSessionSchema.plugin(findOrCreate);
  
  ssoSessionSchema.pre('save', function(next){
    var now = new Date();
    this.updatedAt = now;
    if ( !this.created_at ) {
      this.createdAt = now;
    }
    next();
  });
  var Site = mongoose.model('SsoSession', ssoSessionSchema);
  
  return Site;
}

module.exports = SsoSessionFactory
