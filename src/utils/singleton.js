var makeFactorySingleton = function (func) {
  var instance = null;
  var called = false;
  var newFunc = function newFunc() {
    if (called) {
      return instance;
    }
    called = true;
    instance = func.apply(
      this,
      [].slice.call(arguments, 0)
    );
    return instance;
  }
  return newFunc;
}
module.exports = makeFactorySingleton;