var singleton = require("../utils/singleton");
var findOrCreate = require('mongoose-findorcreate');
var Q = require('q');


var UserModelFactory = function (mongoose) {
  var userSchema, User;
  var normalizedPath = require("path").join(__dirname, "../auth");
  
  userSchema = new mongoose.Schema({
    //email: { type: String, default: '' },
    //password: { type: String, default: '' },
    setting: {},
    username: String,
    isAdmin: { type: Boolean, default: 'false' },
    sites: [{type: mongoose.Schema.ObjectId, ref: 'Site'}]
  });
  
  userSchema.plugin(findOrCreate);
  

  // inject auth strategys
  var strategys = require("fs").readdirSync(normalizedPath).map(function(file) {
    return require("../auth/" + file);
  });
  
  var authMethods = {};
  
  strategys.forEach(function (strategy) {
    authMethods[strategy.name] = strategy.dataSchema
    if (strategy.methods) {
      for (var i in strategy.methods) {
        userSchema.methods[i] = strategy.methods[i];
      }
    }
  })
  
  userSchema.add({
    authMethods: authMethods
  });
  
  userSchema.methods.toSafeObject = function toSafeObject() {
    var obj = this.toObject();
    delete obj.authMethods; // they shouldn't know this
    return obj;
  }
  
  User = mongoose.model('User', userSchema);
  
  return User;
}

module.exports = singleton(UserModelFactory);