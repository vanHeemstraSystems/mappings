/*
 * filename: libraries.js
 *
 * input: input - an Object
 *
 * output: resolve - a Promise
 */
module.exports = function(input) {
  console.log('libraries - called');
  var _Me = {};
  var path = require('../libraries/path'); // hard coded for now
  var paths = require('../paths/paths'); // hard coded for now
  var Promise = require(path.join(paths.libraries, '/bluebird.js')); // hard coded for now
  // Create a new Promise
  return new Promise(function(resolve) {
    console.log('libraries - inside Promise');
    var path = require('../libraries/path');
    _Me.path = path;
    resolve(_Me);
  }); // eof Promise
}