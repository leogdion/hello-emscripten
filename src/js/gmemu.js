!function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(name, definition)
    else this[name] = definition()
}('gmemujs', function () {
  
    // Module here
  var Module = function () {
    include "../../tmp/build/a.out.js"
    return Module;
  }();
  
  return {
    helloWorld : Module.cwrap('gmemujs_test', "string", [])
  };
});