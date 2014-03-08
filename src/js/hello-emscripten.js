!function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(name, definition)
    else this[name] = definition()
}('hello_emscripten', function () {
  
    // Module here
  var Module = function () {
    include "../../tmp/hello-emscripten.js"
    return Module;
  }();
  
  return {
    hello : Module.cwrap('hello_world', "string", [])
  };
});