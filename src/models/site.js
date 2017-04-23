var findOrCreate = require('mongoose-findorcreate');

var SiteModelFactory = function (mongoose) {
  var siteSchema = new mongoose.Schema({
    name: { type: String, default: 'Unamed Site' },
    type: { type: String, enum: ['static'], default: 'static' },
    data: {}
  });
  
  siteSchema.plugin(findOrCreate);
  
  var Site = mongoose.model('Site', siteSchema);
  
  return Site;
}

module.exports = SiteModelFactory
