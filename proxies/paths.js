/*
 * filename: paths.js
 *
 * input: input - an Object
 *
 * output: resolve - a Promise
 */
module.exports = function(input) {
  console.log('paths - called');
  var _Me = {};
  var path = require('../libraries/path'); // hard coded for now
  var paths = require('../paths/paths'); // hard coded for now
  var Promise = require(path.join(paths.libraries, '/bluebird.js')); // hard coded for now
  // Create a new Promise
  return new Promise(function(resolve) {
    console.log('paths - inside Promise');
    var paths = require('../paths/paths');
    _Me.paths = paths;
    resolve(_Me.paths); // Note: return only the paths property
  }); // eof Promise
}