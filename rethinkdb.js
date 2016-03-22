/*
 * RethinkDB Mapping
 *
 * Input: config
 */
module.exports = function(config) {
  var _RethinkDB = {};
  var path = require('../libraries/path');
  var paths = require('../paths/paths');
  console.log("Mappings rethinkdb required.");
  // to do ... do mapping to rethinkdb here... see 'thinky' as an example
  // a lightweight NodeJS ORM for RethinkDB. https://thinky.io/
  rethinkdb = require(__dirname+'/rethinkdb/rethinkdb.js')(config);// call it with config
  _RethinkDB = rethinkdb;
  return _RethinkDB;
};//does not call itself
