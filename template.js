/*
 * filename: <filename.js>
 *
 * input: input - an Object
 *
 * output: resolve - a Promise
 */
module.exports = function(input) {
  var _Me = {};
  var _Me.input = input;
  var proxies = require('../proxies/proxies.js'); // A function that returns a Promise
    proxies()
      .then(function(proxies) {
        _Me.proxies = proxies;
      }); //eof proxies
  return new _Me.proxies.libraries.promise(function(resolve) {
    // put module properties and logic here

    resolve(_Me);
  }); // eof Promise
} // eof module
