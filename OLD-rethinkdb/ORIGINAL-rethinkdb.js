var path = require('../../libraries/path');
var paths = require('../../paths/paths');
var rethinkdbdash = require(path.join(paths.libraries, '/rethinkdbdash.js'));
var Promise = require(path.join(paths.libraries, '/bluebird.js'));
var util = require(__dirname+'/util.js');
var type = require(__dirname+'/type/index.js');
var Query = require(__dirname+'/query.js');
var Errors = require(__dirname+'/errors.js');
var model = "rethinkdb";

console.log('mappings/rethinkdb/rethinkdb - called');  // We get to here!

var models = require(path.join(paths.models, '/models.js')); // A function that returns a Promise

console.log('mappings/rethinkdb/rethinkdb - models: ', models); // We get to here!

models(model)
  .then(function(models) {
    console.log('Mapping - models: ', models);
    var Model = models.model;
    console.log('Mapping - Model: ', Model);

    console.log('++++++++++++++++++++++++++++ LOG POINT mappings/rethinkdb/rethinkdb 1 ++++++++++++++++++++++++++++'); // SO FAR SO GOOD

    //MOVE TO TOP var util = require(__dirname+'/util.js');
    //MOVE TO TOP var type = require(__dirname+'/type/index.js');
    //MOVE TO TOP var Query = require(__dirname+'/query.js');
    //MOVE TO TOP var Errors = require(__dirname+'/errors.js');

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
      console.log('Mapping rethinkdb - RethinkDB called');
      console.log('Mapping rethinkdb - config ', config);
      var self = this;
  
      config = config || {};
      config.db = config.db || 'test'; // We need the default db to create it.
      self._config = config;

      console.log('Mapping rethinkdb - self._config: ', self._config);

      self._options = {};
      // Option passed to each model we are going to create.
      self._options.enforce_missing =
        (config.enforce_missing != null) ? config.enforce_missing : false;
      self._options.enforce_extra =
        (config.enforce_extra != null) ? config.enforce_extra : "none";
      self._options.enforce_type =
        (config.enforce_type != null) ? config.enforce_type : 'loose';

      // Format of time objects returned by the database, by default we convert
      // them to JavaScript Dates.
      self._options.timeFormat =
        (config.timeFormat != null) ? config.timeFormat : 'native';
      // Option passed to each model we are going to create.
      self._options.validate =
        (config.validate != null) ? config.validate : 'onsave';

      console.log('Mapping rethinkdb - config.r: ', config.r);

      if (config.r === undefined) {
        self.r = rethinkdbdash(config); // DOES IT WORK??
        //self.r = require(path.join(paths.libraries, '/rethinkdbdash.js'))(config); // WORKS!!!
      }
      else {
        self.r = config.r;
      }
      console.log('Mapping rethinkdb - self.r: ', self.r);

      self.type = type;
      console.log('Mapping rethinkdb - self.type: ', self.type);

      self.Query = Query;
      console.log('Mapping rethinkdb - self.Query: ', self.Query);

      self.models = {};
      console.log('Mapping rethinkdb - self.models: ', self.models);

      // Export errors
      self.Errors = Errors;
      console.log('Mapping rethinkdb - self.Errors: ', self.Errors);

      // Initialize the database.
      self.dbReady().then().error(function(error) {
        throw error;
      });
    }

    /**
     * Initialize our database.
     * @return {Promise=} Returns a promise which will resolve when the database is ready.
     */
    RethinkDB.prototype.dbReady = function() {
      console.log('Mapping rethinkdb - RethinkDB.prototype.dbReady called');	
      var self = this;
      if (this._dbReadyPromise) return this._dbReadyPromise;
      var r = self.r;

      console.log('Mapping rethinkdb - r: ', r); // {"db": "test"}
      console.log('Mapping rethinkdb - self._config.db: ', self._config.db); // test

      this._dbReadyPromise = r.dbCreate(self._config.db)
      .run()
      .error(function(error) {
        // The `do` is not atomic, we a concurrent query could create the database
        // between the time `dbList` is ran and `dbCreate` is.
        if (error.message.match(/^Database `.*` already exists in/)) {
          return;
        }

        // In case something went wrong here, we do not recover and throw.
        throw error;
      });

      return self._dbReadyPromise;
    };

    /**
     * Return the current option used.
     * @return {object} The global options of the library
     */
    RethinkDB.prototype.getOptions = function() {
      console.log('Mapping rethinkdb - RethinkDB.prototype.getOptions called');	
      return this._options;
    }

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
      console.log('Mapping rethinkdb - RethinkDB.prototype.createModel called');		
      var self = this;

      // Make a deep copy of the options as the model may overwrite them.
      var fullOptions = util.deepCopy(this._options);
      options = options || {};
      util.loopKeys(options, function(options, key) {
        fullOptions[key] = options[key];
      });

      // Two models cannot share the same name.
      if (self.models[name] !== undefined) {
        throw new Error("Cannot redefine a Model");
      }

      // Create the constructor returned. This will also validate the schema.
      var model = Model.new(name, schema, fullOptions, self);

      // Keep a reference of this model.
      self.models[name] = model;
      return model;
    }

    /**
     * Method to clean all the references to the models. This is used to speed up
     * testing and should not be used in other use cases.
     */
    RethinkDB.prototype._clean = function() {
      console.log('Mapping rethinkdb - RethinkDB.prototype._clean');	
      this.models = {};
    }


    console.log('++++++++++++++++++++++++++++ LOG POINT mappings/rethinkdb/rethinkdb 2 ++++++++++++++++++++++++++++'); // So far so good

    
    // is config defined here?
    console.log('++++++++++++++++++ config: ', config);  // WE DO NOT GET TO HERE !!!!! ... Fix it!!



    // Export the module.
    module.exports = function(config) {
      console.log('Mapping rethinkdb - RethinkDB module.exports - called');	
      console.log('Mapping rethinkdb - config: ', config);
      return new RethinkDB(config);
    }


    console.log('++++++++++++++++++++++++++++ LOG POINT mappings/rethinkdb/rethinkdb 3 ++++++++++++++++++++++++++++'); // So far so good


    // Expose rethinkdb types directly from module
    module.exports.type = type;

    console.log('++++++++++++++++++++++++++++ LOG POINT mappings/rethinkdb/rethinkdb 1 ++++++++++++++++++++++++++++');



  }); //eof then