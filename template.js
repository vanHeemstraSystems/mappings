/*
 * module name
 *
 * input: <input> - an Object
 *
 * output: resolve - a Promise
 */

module.exports = function(input) {
  var _Me = {};
  var _Me.input = input;
  var libraries = require(__dirname+'/libraries.js'); // A function that returns a Promise
    libraries()
      .then(function(libraries) {
        _Me.libraries = libraries;
      }); //eof libraries
  var paths = require(__dirname+'/paths.js'); // A function that returns a Promise
    paths()
      .then(function(paths) {
        _Me.paths = paths;
      }); //eof paths

	/*
	 * libraries
	 */
	//var path  = require('../../libraries/path')
	//   ,paths = require('../../paths/paths')
	//   ,Promise = require(path.join(paths.libraries, '/bluebird.js'));

  var promises = require(__dirname+'/promises.js'); 
    promises()
      .then(function(promises) {
        return new promises.Promise(function(resolve) {
          // put module properties and logic here

           resolve(_Me);
        }); // eof Promise
      }); //eof promises
} // eof module
