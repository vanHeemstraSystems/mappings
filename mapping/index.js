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
Mapping.prototype.rethinkDB = function() {
  return new MappingRethinkDB();
}

module.exports = Mapping;
