// in order to make oauth auth send custom query

function patchClass(classInstance) {
  const old_authorizationParams = classInstance.prototype.authorizationParams;
  classInstance.prototype.authorizationParams = function authorizationParams(options) {
    const params = old_authorizationParams.call(this, options);
    
    if (options.customQuery && 'object' === typeof options.customQuery) {
      for (let key in options.customQuery) {
        params[key] = options.customQuery[key];
      }
    }
    
    return params
  }
  
}

module.exports = patchClass