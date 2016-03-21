/*
 * RethinkDB Mapping
 */
module.exports = function() {
  var _RethinkDB = {};
  var path = require('../libraries/path');
  var paths = require('../paths/paths');
  config = require(path.join(paths.configurations, '/configurations.js'))();
  var common = config.common,
  server_prefix = common.server_prefix || 'PREFIX';
  console.log(server_prefix + " - Mappings rethinkdb required.");
  // to do ... do mapping to rethinkdb here... see 'thinky' as an example
  // a lightweight NodeJS ORM for RethinkDB. https://thinky.io/
  rethinkdb = require('./rethinkdb/rethinkdb.js');
  _RethinkDB = rethinkdb;
  return _RethinkDB;
};//does not call itself
