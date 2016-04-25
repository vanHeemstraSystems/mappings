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
 * Create a new ProxiesProxy object.
 * @return {ProxiesProxy}
 */
Mappings.prototype.mapping = function() {
  return new MappingsMapping();
}

//ORIGINAL module.exports = new Mappings();
module.exports = function() { return new Mappings(); }
