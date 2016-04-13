/*
 * filename: promises.js
 *
 * input: input - an Object
 *
 * output: resolve - a Promise
 */
module.exports = function(input) {
  console.log('promises - called');
  var _Me = {};
  // Create a new Promise
  return new Promise(function(resolve) {
    console.log('promises - inside Promise');
    var path = input.libraries.path; // require('../libraries/path'); // Hard coded for now
    var paths = input.paths.paths; //require('../paths/paths'); // Hard coded for now
    var promise = require(path.join(paths.libraries, '/bluebird.js'));
    _Me.promise = promise;
    resolve(_Me);
  }); // eof Promise
}
