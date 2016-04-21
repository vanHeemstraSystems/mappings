/*
 * rethinkdb.js
 * 
 * input: config - an Object
 *
 * output: resolve - a Promise
 */
module.exports = function(config) {
  console.log('rethinkdb - called');
  console.log('rethinkdb - config: ', config);
  var _Me = {};  
  var path = require('../../libraries/path');
  var paths = require('../../paths/paths'); 
  var promise = require(path.join(paths.libraries, '/promise.js'));
  var rethinkdbdash = require(path.join(paths.libraries, '/rethinkdbdash.js'));
  var util = require(__dirname+'/util.js');
  var type = require(__dirname+'/type/index.js');
  var Query = require(__dirname+'/query.js');
  var Errors = require(__dirname+'/errors.js');
  var _model = "rethinkdb";
  var _models = require(path.join(paths.models, '/models.js')); // A function that returns a Promise
  var join = promise.join;
  return new promise(function(resolve) {
    join(_models(_model), function(models) {
      _Me.models = models;   // WAS     var Model = models.model;



    //  more



    }); // eof join
    console.log('rethinkdb - resolve(_Me): ', _Me);
    resolve(_Me);
  }) // eof promise
  .catch(function(error) {
    console.log('rethinkdb - error: ', error);
  }) // eof catch
  .finally(function() {
    console.log('rethinkdb - finally');
  }); // eof finally
} // eof module 
