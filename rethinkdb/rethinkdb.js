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

  var util = require(__dirname+'/util.js');  // This module will have to move to its own subtree
  _Me.util = util;

  //var type = require(__dirname+'/type/index.js');  // This module will have to move to its own subtree
  var _types = require(path.join(paths.types, '/types.js')); // A function that returns a Promise

  //var Query = require(__dirname+'/query.js');  // This module will have to move to its own subtree
  var _queries = require(path.join(paths.queries, '/queries.js')); // A function that returns a Promise

  var Errors = require(__dirname+'/errors.js');  // This module will have to move to its own subtree
  _Me.errors = Errors;

  var _model = "rethinkdb";
  var _models = require(path.join(paths.models, '/models.js')); // A function that returns a Promise
  var join = promise.join;
  return new promise(function(resolve) {
    join(_models(_model), _queries(), _types(), function(models, queries, types) {
      _Me.models = models;   // WAS     var Model = models.model;
      _Me.queries = queries;
      _Me.types = types;
      /**
       * Main method, create the default database.
       *
       * @param {Object} options the options for the driver and the future models created.
       *  - `max` {number} The maximum number of connections in the pool, default 1000
       *  - `buffer` {number} The minimum number of connections available in the pool, default 50
       *  - `timeoutError` {number} The wait time before reconnecting in case of an error (in ms), default 1000
       *  - `timeoutGb` {number} How long the pool keep a connection that hasn't been used (in ms), default 60*60*1000
       *  - `enforce_missing` {boolean}, default `false`
       *  - `enforce_extra` {"strict"|"remove"|"none"}, default `"none"`
       *  - `enforce_type` {"strict"|"loose"|"none"}, default `"loose"`
       *  - `timeFormat` {"raw"|"native"}
       */
      function RethinkDB(config) {
        console.log('mapping rethinkdb - RethinkDB called');
        console.log('mapping rethinkdb - config ', config);


        // more, see ORIGINAL-rethinkdb,js


      }; // eof function RethinkDB(config)

      /**
       * Initialize our database.
       * @return {Promise=} Returns a promise which will resolve when the database is ready.
       */
      RethinkDB.prototype.dbReady = function() {
        console.log('mapping rethinkdb - RethinkDB.prototype.dbReady called');

        // more, see ORIGINAL-rethinkdb,js 

      }; // eof function RethinkDB.prototype.dbReady

      /**
       * Return the current option used.
       * @return {object} The global options of the library
       */
      RethinkDB.prototype.getOptions = function() {
        console.log('mapping rethinkdb - RethinkDB.prototype.getOptions called');	
        return this._options;
      }; // eof function RethinkDB.prototype.getOptions

      /**
       * Create a model
       *
       * @param {string} name The name of the table used behind this model.
       * @param {object|Type} schema The schema of this model.
       * @param {object=} options Options for this model. The fields can be:
       *  - `init` {boolean} Whether the table should be created or not. The value
       *  `false` is used to speed up testing, and should probably be `true` in
       *  other use cases.
       *  - `timeFormat` {"raw"|"native"} Format of ReQL dates.
       *  - `enforce_missing` {boolean}, default `false`.
       *  - `enforce_extra` {"strict"|"remove"|"none"}, default `"none"`.
       *  - `enforce_type` {"strict"|"loose"|"none"}, default `"loose"`.
       *  - `validate` {"oncreate"|"onsave"}, default "onsave".
       */
      RethinkDB.prototype.createModel = function(name, schema, options) {
        console.log('mapping rethinkdb - RethinkDB.prototype.createModel called');


        // more, see ORIGINAL-rethinkdb,js 


      }; // eof function RethinkDB.prototype.createModel

      /**
       * Method to clean all the references to the models. This is used to speed up
       * testing and should not be used in other use cases.
       */
      RethinkDB.prototype._clean = function() {
        console.log('mapping rethinkdb - RethinkDB.prototype._clean');	
        this.models = {};
      }; // eof function RethinkDB.prototype._clean

      // Export the module.
      module.exports = function(config) {
        console.log('mapping rethinkdb - RethinkDB module.exports - called');	
        console.log('mapping rethinkdb - config: ', config);
        return new RethinkDB(config);
      }
      // Expose rethinkdb types directly from module
      module.exports.type = _Me.types.type;// WAS module.exports.type = type;
    }); // eof join
    console.log('mapping rethinkdb - resolve(_Me): ', _Me);
    resolve(_Me);
  }) // eof promise
  .catch(function(error) {
    console.log('mapping rethinkdb - error: ', error);
  }) // eof catch
  .finally(function() {
    console.log('mapping rethinkdb - finally');
  }); // eof finally
} // eof module 
