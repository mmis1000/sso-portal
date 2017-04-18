var singleton = require("../utils/singleton");
var findOrCreate = require('mongoose-findorcreate');
var Q = require('q');


var UserModelFactory = function (mongoose) {
  var userSchema, User;
  var nooz = function () {}
  var normalizedPath = require("path").join(__dirname, "../auth");
  
  userSchema = new mongoose.Schema({
    name: { type: String, default: 'Anonymous' },
    
    //email: { type: String, default: '' },
    //password: { type: String, default: '' },
    setting: {},
    username: String
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
    delete obj.authMethods; // thet shouldn't know this
    return obj;
  }
  
  User = mongoose.model('User', userSchema);
  
  return User;
}

module.exports = singleton(UserModelFactory);