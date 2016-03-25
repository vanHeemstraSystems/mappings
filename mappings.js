/*
 * Mappings
 * 
 * param: mapping (e.g. 'rethinkdb')
 */
module.exports = function(mapping) {
  var mapping = mapping.toLowerCase();
  var _Mappings = {};
  var path = require('../libraries/path');
  var paths = require('../paths/paths');
  //config = require(path.join(paths.configurations, '/configurations.js'))(mapping);
  //var common = config.common,
  var common = {server_prefix: 'CORE'}, // temp
  server_prefix = common.server_prefix || 'PREFIX';
  console.log(server_prefix + " - Mappings mappings required.");
  _Mappings.mapping = require(__dirname+'/'+mapping+'.js');
  return _Mappings;
};//does not call itself
