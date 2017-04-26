var findOrCreate = require('mongoose-findorcreate');

var SiteModelFactory = function (mongoose) {
  var siteSchema = new mongoose.Schema({
    name: { type: String, default: 'Unamed Site' },
    type: { type: String, enum: ['static'], default: 'static' },
    entry: { type: String, default: 'http://example.com/' },
    domain: { type: String, default: 'http://example.com' },
    data: {}
  });
  
  siteSchema.plugin(findOrCreate);
  
  var Site = mongoose.model('Site', siteSchema);
  
  return Site;
}

module.exports = SiteModelFactory
