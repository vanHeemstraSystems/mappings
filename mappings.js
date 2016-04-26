/*
 * mappings.js
 */
var MappingsMapping = require(__dirname+'/mapping.js');

/**
 * Create a new Mappings that let users create sub-mappings.
 * @return {Mappings}
 */
function Mappings() { }

/**
 * Create a new MappingsMapping object.
 * @return {MappingsMapping}
 */
Mappings.prototype.mapping = function() {
  return new MappingsMapping();
}

module.exports = Mappings;
