/*
 * Following the example from https://github.com/neumino/thinky
 */

var Mappings = require(__dirname+'/mappings.js')('RethinkDB');
console.log('Mappings: ', Mappings);

//now call RethinkDB mapping

var Mapping = Mappings.mapping();
console.log('Mapping: ', Mapping);

var type = Mapping.type;
console.log('type: ', type);