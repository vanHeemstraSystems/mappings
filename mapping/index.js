/*
 * index.js
 */
var MappingRethinkDB = require(__dirname+'/rethinkdb.js');

/**
 * Create a new Mapping that let users create sub-mappings.
 * @return {Mapping}
 */
function Mapping() { }

/**
 * Create a new MappingRethinkDB object.
 * @return {MappingRethinkDB}
 */
Mapping.prototype.rethinkdb = function(config) {
  return new MappingRethinkDB(config);
}

module.exports = Mapping;
