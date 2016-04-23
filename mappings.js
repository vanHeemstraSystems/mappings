/*
 * mappings.js
 *
 * input: input - an Object
 *
 * output: resolve - a Promise
 */
module.exports = function() {
  console.log('mappings - called');
  var _Me = {};
  var path = require('../libraries/path');
  var paths = require('../paths/paths'); 
  var promise = require(path.join(paths.libraries, '/promise.js'));
  var _mapping = require(__dirname+'/mapping.js'); // a function that returns a Promise
  var join = promise.join;
  return new promise(function(resolve) {
    join(_mapping(), function(mapping) {
      _Me.mapping = mapping;
    }); // eof join
    console.log('mappings - resolve(_Me): ', _Me);
    resolve(_Me);
  }) // eof promise
  .catch(function(error) {
    console.log('mappings - error: ', error);
  }) // eof catch
  .finally(function() {
    console.log('mappings - finally');
  }); // eof finally
} // eof module