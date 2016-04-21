/*
 * rethinkdb.js
 *
 * input: config - an Object
 *
 * output: resolve - a Promise
 */
module.exports = function() {
  console.log('RethinkDB - called');
  var _Me = {};
  var path = require('../libraries/path');
  var paths = require('../paths/paths'); 
  var promise = require(path.join(paths.libraries, '/promise.js'));
  var _rethinkdb = require(__dirname+'/rethinkdb/rethinkdb.js'); // A function that returns a Promise
  var join = promise.join;
  return new promise(function(resolve) {
    join(_rethinkdb(), function(rethinkdb) {
      _Me.rethinkdb = rethinkdb;
    }); // eof join
    console.log('rethinkdb - resolve(_Me.rethinkdb): ', _Me.rethinkdb);
    resolve(_Me.rethinkdb); // Note: return _Me.rethinkdb only
  }) // eof promise
  .catch(function(error) {
    console.log('rethinkdb - error: ', error);
  }) // eof catch
  .finally(function() {
    console.log('rethinkdb - finally');
  }); // eof finally


/*

  // Create a new Promise
  return new Promise(function(resolve) {
    console.log('RethinkDB - inside Promise');
    var configurations = "PUT_CONFIGURATIONS_HERE"; // To Do !!! HOW ARE WE GOING TO PROVIDE THE CONFIGURATIONS FOR RETHINKDB??
    var rethinkdb = require(__dirname+'/rethinkdb/rethinkdb.js'); // A function that returns a Promise

    // error occurs here
    // Unhandled rejection TypeError: rethinkdb is not a function
    //at C:\Users\vanheemstraw\git\vanHeemstraSystems\mappings\rethinkdb.js:23:5

    // we don't get to here, so repair within rethinkdb/rethinkdb.js... is it indeed a function that returns a Promise?

    // Check what rethinkdb is
    console.log('RethinkDB - rethinkdb: ', rethinkdb);


    rethinkdb(configurations)
      .then(function(rethinkdb) {
        console.log('RethinkDB - rethinkdb: ', rethinkdb);
        _RethinkDB = rethinkdb;
      }); // eof rethinkdb()
    console.log('RethinkDB - resolve');  
    resolve(_RethinkDB);
  }); // eof Promise
*/


} // eof module

// OLD

// module.exports = function(config) {
//   var _RethinkDB = {};
//   var path = require('../libraries/path');
//   var paths = require('../paths/paths');
//   console.log("Mappings rethinkdb required.");
//   // to do ... do mapping to rethinkdb here... see 'thinky' as an example
//   // a lightweight NodeJS ORM for RethinkDB. https://thinky.io/
//   rethinkdb = require(__dirname+'/rethinkdb/rethinkdb.js')(config);// call it with config
//   _RethinkDB = rethinkdb;
//   return _RethinkDB;
// };//does not call itself
