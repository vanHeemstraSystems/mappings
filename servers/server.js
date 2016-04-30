/*
 * server.js
 *
 * Usage: call as follows whilst making sure to use the escaped quotes and avoid spaces e.g. 
 *
 * node server.js {\"uuid\":\"6e8bc430-9c3a-11d9-9669-0800200c9a66\"}
 *
 * Following the example from https://github.com/neumino/thinky/examples/basic-todo
 * but with our own modifications (removal of 'thinky' and 'rethinkdbdash')
 */

/*
 * See also http://alexperry.io/node/2015/03/25/promises-in-node.html
 */

// Required modules
var _proxies = require('../../proxies/proxies');
// ONLY ENDPOINTS OF _proxies ARE Promises, e.g. _proxies().proxy().libraries().library().path()
// WE POSTPONE TO USE A Promise DOWN THE OBJECT HIERARCHY AS FAR DOWN AS FEASIBLE
// UNTIL WE NEED THE Promise RESOLVED
// console.log('server - _proxies: ', _proxies);                                                                                                    // function () { return new Proxies(); }
// console.log('server - _proxies(): ', _proxies());                                                                                                // Proxies {}
// console.log('server - _proxies().proxy: ', _proxies().proxy);                                                                                    // function () { return new ProxiesProxy(); }
// console.log('server - _proxies().proxy(): ', _proxies().proxy());                                                                                // Proxy {}
// console.log('server - _proxies().proxy().libraries: ', _proxies().proxy().libraries);                                                            // function () { return new ProxyLibraries(); }
// console.log('server - _proxies().proxy().libraries(): ', _proxies().proxy().libraries());                                                        // Libraries {}
// console.log('server - _proxies().proxy().libraries().library: ', _proxies().proxy().libraries().library);                                        // function () { return new LibrariesLibrary(); } 
// console.log('server - _proxies().proxy().libraries().library(): ', _proxies().proxy().libraries().library());                                    // Library {}
// console.log('server - _proxies().proxy().libraries().library().path: ', _proxies().proxy().libraries().library().path);                      // function () { return new LibraryPath(); }
// console.log('server - _proxies().proxy().libraries().library().path(): ', _proxies().proxy().libraries().library().path());                      // LibraryPath { _default: Object, _validator: undefined, _options: {} } 
// console.log('server - _proxies().proxy().libraries().library().promise(): ', _proxies().proxy().libraries().library().promise());
var promise = _proxies().proxy().libraries().library().promise();
var join = promise.join;

// Start of the chain
join(_proxies(), function(proxies) {
  console.log('server - proxies: ', proxies); // Works: Proxies {}
  return(proxies);
}) //eof join proxies
.then(function(proxies) {
  var resourceForUuid = {};
  var uuid = {};
  // process.argv is an array containing the command line arguments. 
  // The first element will be 'node', the second element will be the name of the JavaScript file. 
  // The next elements will be any additional command line arguments.
  process.argv.forEach(function (val, index, array) {
    // index 0 will be path to and node executable
	// index 1 will be path to and this file
	// index 2 will be optional additional command line arguments, e.g. a JSON file {uuid:1234}
	// console.log(index + ': ' + val);
	// catch the val at index 2
    switch(index) {
      case 0: // node
        break; // eof case 0
      case 1: // this file
        break; // eof case 1
      case 2: // optional additional command line argument
        console.log('server - additional command: ', val);
        try {
          var o = JSON.parse(val);
		  // Handle non-exception-throwing cases:
		  // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
		  // but... JSON.parse(null) returns 'null', and typeof null === "object", 
		  // so we must check for that, too.
	      if (o && typeof o === "object" && o !== null) {
			// return o;
			// now we have the object o
            console.log('server - object: ', o);
            uuid = o.uuid;
            console.log('server - uuid: ', uuid);
			// Get a resource, by comparing with the uuid
//            console.log('server - resource: ', _proxies().proxy().resources().resource); // function () { return new ResourcesResource(); }
//            console.log('server - _proxies().proxy().resources().resource(): ', _proxies().proxy().resources().resource());  // Resource {}
//            console.log('server - _proxies().proxy().resources().resource()._6e8bc430_9c3a_11d9_9669_0800200c9a66: ', _proxies().proxy().resources().resource()._6e8bc430_9c3a_11d9_9669_0800200c9a66);
//            console.log('server - _proxies().proxy().resources().resource()._6e8bc430_9c3a_11d9_9669_0800200c9a66(): ', _proxies().proxy().resources().resource()._6e8bc430_9c3a_11d9_9669_0800200c9a66());
            var resource = _proxies().proxy().resources().resource();
            console.log('server - resource: ', resource);
            for (var key in resource) {
            	console.log('server - key: ', key);
            	// strip prefix _ if present on key, then substitute all _ for - if present on key
                var keyUuid = key.replace(/^\_/, "").replace(/_/g, "\-");
                console.log('server - keyUuid: ', keyUuid);
                if(uuid == keyUuid) {
                  console.log('server - uuid == keyUuid');
                  // do something
                  resourceForUuid = resource[key]();
                  break;
                }
			}
            console.log('server - resourceForUuid: ', resourceForUuid);
          } // eof if
        } // eof try
        catch (e) { 
          console.log('server - error: ', e);
        } // eof catch
        break; // eof case 2
      default:
        // do nothing
      break;
    } // eof switch
  }); // forEach
  // Validate resourceForUuid
  if(Object.keys(resourceForUuid).length == 0) {
  	// raise an error, the resourceForUuid has not been found
  	throw new Error("No resource found for uuid: ", uuid); // TO FIX: for some reason the value of uuid is empty here
  } 
  else {
  	return resourceForUuid;
  };
}) //eof then proxies
.then(function(resourceForUuid) {
  console.log('server - resourceForUuid: ', resourceForUuid); // Works: e.g. _6e8bc430_9c3a_11d9_9669_0800200c9a66 { URI: 'urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66' }
  // Get the configurations for resourceForUuid
  console.log('server - resourceForUuid.URI: ', resourceForUuid.URI);
  var configurationForUuid = {};
  // See also 
  // https://medialize.github.io/URI.js/
  // var uri = URI("urn:uuid:c5542ab6-3d96-403e-8e6b-b8bb52f48d9a?query=string");
  // uri.protocol() == "urn";
  // uri.path() == "uuid:c5542ab6-3d96-403e-8e6b-b8bb52f48d9a";
  // uri.query() == "query=string";
  // console.log('server - library: ', _proxies().proxy().libraries().library); // function () { return new LibrariesLibrary(); }
  // console.log('server - _proxies().proxy().libraries().library(): ', _proxies().proxy().libraries().library());  // Library {}
  // console.log('server - _proxies().proxy().libraries().library().uri: ', _proxies().proxy().libraries().library().uri); // function () { return new LibraryUri(); }
  // console.log('server - _proxies().proxy().libraries().library().uri(): ', _proxies().proxy().libraries().library().uri());
  console.log('server - resource.URI: ', resourceForUuid.URI);
  var uri = new _proxies().proxy().libraries().library().uri(resourceForUuid.URI);
  console.log('server - uri: ', uri);
  var scheme = uri.scheme(); // get scheme from URI e.g. 'urn' or 'url';
  console.log('server - scheme: ', scheme);
  var namespaceIdentifier = uri.heirpart().value.split(':')[0]; // get NID from uri e.g. 'uuid' or 'http'
  console.log('server - namespaceIdentifier: ', namespaceIdentifier);
  var namespaceSpecificString = uri.heirpart().value.split(':')[1]; //get NSS from uri e.g. '6e8bc430-9c3a-11d9-9669-0800200c9a66'
  console.log('server - namespaceSpecificString: ', namespaceSpecificString);
  switch(scheme) {
  	case 'url:':
      console.log('server - scheme: ', scheme);
  	  // handle url, for remote files
	  // TODO
	  break;
    case 'urn:':
      // handle urn, for local files
 	  console.log('server - scheme: ', scheme);
	  console.log('server - uri.value: ', uri.value);
	  var uriParts = uri.value.split(':');
	  console.log('server - uriParts: ', uriParts);
	  // Look for the occurence of 'uuid' in the array of uriParts
	  var uriUuidKeyIndex = uriParts.indexOf('uuid'); // returns the index if the found Object
	  console.log('server - uriUuidKeyIndex: ', uriUuidKeyIndex);
	  if (uriUuidKeyIndex >= 0) {
	    var uuid = uriParts[uriUuidKeyIndex+1]; 
	    console.log('server - uuid: ', uuid);
	    // Get a configuration, by comparing with the uuid
	    //console.log('server - configuration: ', _proxies().proxy().configurations().configuration); // function () { return new ConfigurationsConfiguration(); }
	    //console.log('server - _proxies().proxy()..configurations().configuration(): ', _proxies().proxy().configurations().configuration());  // Configuration {}
	    //console.log('server - _proxies().proxy().configurations().configuration()._6e8bc430_9c3a_11d9_9669_0800200c9a66: ', _proxies().proxy().configurations().configuration()._6e8bc430_9c3a_11d9_9669_0800200c9a66);
	    //console.log('server - _proxies().proxy().configurations().configuration()._6e8bc430_9c3a_11d9_9669_0800200c9a66(): ', _proxies().proxy().configurations().configuration()._6e8bc430_9c3a_11d9_9669_0800200c9a66());
	    var configuration = _proxies().proxy().configurations().configuration();
	    console.log('server - configuration: ', configuration);
	    for (var key in configuration) {
	      console.log('server - key: ', key);
	      // Strip prefix _ if present on key, then substitute all _ for - if present on key
	      var keyUuid = key.replace(/^\_/, "").replace(/_/g, "\-");
	      console.log('server - keyUuid: ', keyUuid);
	      if(uuid == keyUuid) {
	        console.log('server - uuid == keyUuid');
	        // Do something
	        configurationForUuid = configuration[key]();
	        break;
	      }
	    } // eof for
	    console.log('server - configurationForUuid: ', configurationForUuid);
	  } // eof if
	  else {
	  	// no uuid in resourceForUuid.URI
	  }
      break;
    default:
      // do nothing
      break;
  }//eof switch
  // Validate configurationForUuid
  if(Object.keys(configurationForUuid).length == 0) {
    // Raise an error, the resourceForUuid has not been found
    throw new Error("No configuration found for uuid: ", uuid); // TO FIX: for some reason the value of uuid is empty here
  } 
  else {
    return configurationForUuid;
  };
}) // eof then resourceForUuid
.then(function(configurationForUuid) {
  // Check which properties are contained within configurationForUuid
  var common = configurationForUuid.common();
  console.log('server - configurationForUuid.common(): ', common);
  // Data protection
  // var private_host = configurationForUuid.common()._host; // This fails, var _host is private therefore hidden from direct access
  // console.log('server - private_host: ', private_host);
  // var public_host = configurationForUuid.common().host(); // This succeeds, the method host() is public, with access to the private var _host
  // console.log('server - public_host: ', public_host);
  var server_prefix = configurationForUuid.common().server_prefix() || 'PREFIX';
  console.log('server - server_prefix: ', server_prefix);

  var serversServer = configurationForUuid.servers().server();
  console.log('server - servers().server(): ', serversServer);

  var serversServerExpress = configurationForUuid.servers().server().express();
  console.log('server - servers().server().express(): ', serversServerExpress);

  var serversServerExpressHost = configurationForUuid.servers().server().express().host();
  console.log('server - servers().server().express().host(): ', serversServerExpressHost); // undefined ?! FIX THIS !!

  // Get the express library
  var express = _proxies().proxy().libraries().library().express; // note: don't call express yet
  console.log('server - express: ', express);
  // Assign express to the server
  var server = express(); // Works!
  console.log('server - server: ', server);

  var mappings = _proxies().proxy().mappings(); // Works!
  console.log('server - mappings: ', mappings);

  var mapping = _proxies().proxy().mappings().mapping(); // Works!
  console.log('server - mapping: ', mapping);

  var rethinkdbMapping = _proxies().proxy().mappings().mapping().rethinkdb; // note: don't call rethinkdb yet
  console.log('server - rethinkdbMapping: ', rethinkdbMapping);

  var config = configurationForUuid.databases().database().rethinkdb();
  console.log('server - config: ', config);

  console.log('server - config.rethinkdb(): ', config.rethinkdb()); // Expected empty Object
  var rethinkdb = _proxies().proxy().databases().database().rethinkdb();
  console.log('server - rethinkdb: ', rethinkdb);
  config.setrethinkdb(rethinkdb); // Set rethinkdb to config
  console.log('server - config.rethinkdb(): ', config.rethinkdb()); // Expected set to RethinkDB

  console.log('server - config.event(): ', config.event()); // Expected empty Object
  var event = _proxies().proxy().events().event();
  config.setevent(event); // Set event to config
  console.log('server - config.event(): ', config.event()); // Expected set to Event

  console.log('server - config.error(): ', config.error()); // Expected empty Object
  var error = _proxies().proxy().errors().error();
  config.seterror(error); // Set error to config
  console.log('server - config.error(): ', config.error()); // Expected set to Error

  console.log('server - config.utility(): ', config.utility()); // Expected empty Object
  var utility = _proxies().proxy().utilities().utility();
  utility.setpromise(_proxies().proxy().libraries().library().promise); // Don't call the promise yet, or should we?
  utility.setevent(_proxies().proxy().events().event);

// WE ARE HERE ! 
  console.log('server - utility: ', utility); // FOR TEST ONLY
  

  utility.inherits(error); // Utility needs to inherit all the error objects // Currently [TypeError: utility.inherits is not a function]
  config.setutility(utility); // Set utility to config
  console.log('server - config.utility(): ', config.utility()); // Expected set to Utility

  console.log('server - config.type(): ', config.type()); // Expected empty Object

  console.log('server - _proxies().proxy().types: ', _proxies().proxy().types); // FOR TESTING ONLY
  console.log('server - _proxies().proxy().types(): ', _proxies().proxy().types()); // FOR TESTING ONLY
  console.log('server - _proxies().proxy().types().type: ', _proxies().proxy().types().type); // FOR TESTING ONLY
  console.log('server - _proxies().proxy().types().type(): ', _proxies().proxy().types().type()); // FOR TESTING ONLY  

  var type = _proxies().proxy().types().type(); // WORKS
  type.seterror(_proxies().proxy().errors().error());  // Does this cause [Error: Cannot find module '../libraries/path'] code: 'MODULE_NOT_FOUND'
  type.setutility(utility);  // Does this cause [Error: Cannot find module '../libraries/path'] code: 'MODULE_NOT_FOUND'
  type.setschema(_proxies().proxy().schemas().schema());  // Does this cause [Error: Cannot find module '../libraries/path'] code: 'MODULE_NOT_FOUND'
  type.setvalidator(_proxies().proxy().libraries().library().validator());  // Does this cause [Error: Cannot find module '../libraries/path'] code: 'MODULE_NOT_FOUND'

  config.settype(type); // Set type to config
  console.log('server - config.type(): ', config.type()); // Expected set to Type

  console.log('server - config.schema(): ', config.schema()); // Expected empty Object
  var schema = _proxies().proxy().schemas().schema(); //---------------------------------------> FIX THIS !! Schema is not a function
  config.setschema(schema); // Set schema to config
  console.log('server - config.schema(): ', config.schema()); // Expected set to Schema

  console.log('server - config.query(): ', config.query()); // Expected empty Object
  var query = _proxies().proxy().queries().query(); //---------------------------------------> FIX THIS !! Query is not a function
  config.setquery(query); // Set query to config
  console.log('server - config.query(): ', config.query()); // Expected set to Query

  // Make sure RethinkDB is running before executing the following instruction
  // On Windows, run rethinkdb.exe
  // On Linux, tbc
  // On Mac, tbc
  var rethinkdbMapping = rethinkdbMapping(config);




//  var rethinkdb = rethinkdbMapping.r;
//  console.log('server - rethinkdb: ', rethinkdb);




//				            .then(function(_Me) {
//				              return(
//				              	join(_Me.proxies.mappings(), function(mappings) { 
//				                  console.log('server - mappings: ', mappings);
//				                  _Me.mappings = mappings; // mappings contains a mapping for rethinkdb
//				                  return(_Me);
//				                }) // eof join
//					            .catch(function(error) {
//				                  console.log('server - error: ', error);
//				                }) // eof catch                
//				              ); // eof return
//				            }); // eof then mappings

				/*				
									// Import mappings
									//	var Mappings = require(__dirname+'/../mappings.js')('RethinkDB'); // here we specify that we want the 'rethinkdb' mapping
									//	console.log(server_prefix + ' - Mappings: ', Mappings);

										// handle mappings like configurations, as a function that returns a promise
					                    var mappings = require(path.join(paths.mappings, 'mappings.js')); // A function that returns a Promise
					                    var mapping = 'rethinkdb'; // here we specify that we want the 'rethinkdb' mapping
					                    mappings(mapping)
					                      .then(function(mappings) {

										    var server_prefix = configurations.common.server_prefix || 'PREFIX';
										    console.log(server_prefix + ' - mappings: ', mappings);
				*/

//					                        console.log('++++++++++++++++++++++++++++ LOG POINT server 0 ++++++++++++++++++++++++++++');

				/*
										    // AMEND FROM BELOW HERE ....

					                        // Call RethinkDB mapping
											console.log(server_prefix + ' - configurations.databases.rethinkdb: ', configurations.databases.rethinkdb);

											// NOTE: 'thinky' is from here on 'Mapping'

					                        console.log('++++++++++++++++++++++++++++ LOG POINT server 1 ++++++++++++++++++++++++++++');


					                        // An error occurs here: 
					                        // Unhandled rejection TypeError: 
					                        // rethinkdb is not a function
					                        // at C:\Users\vanheemstraw\git\vanHeemstraSystems\mappings\rethinkdb.js:23:5

					                        // Check to see if the Mappings object is valid:
					                        console.log(server_prefix + ' - Mappings: ', Mappings);






											var Mapping = Mappings.mapping(configurations.databases.rethinkdb);// call the 'rethinkdb' mapping, providing it with the config for rethinkdb

					                        //FAILS BEFORE WE COME TO HERE: require(..) is not a function

											console.log(server_prefix + ' - Mapping: ', Mapping);

											console.log('++++++++++++++++++++++++++++ LOG POINT server 2 ++++++++++++++++++++++++++++');

											var r = Mapping.r;
											console.log(server_prefix + ' - r: ', r);

											var type = Mapping.type;
											console.log(server_prefix + ' - type: ', type);

											// Create the model
											//WAS var Todo = thinky.createModel("todos", {
											var Todo = Mapping.createModel("todos", {
											    id: type.string(),
											    title: type.string(),
											    completed: type.boolean(),
											    createdAt: type.date().default(r.now())
											});
											console.log(server_prefix + ' - Todo: ', Todo);

											// Ensure that an index createdAt exists
											Todo.ensureIndex("createdAt");

											server.use(_Me.proxies.libraries.express.static(__dirname + '/../publications'));
											//DEPRECATED server.use(bodyParser());
											server.use(_Me.proxies.libraries.bodyParser.urlencoded({
											  extended: true
											}));
											server.use(_Me.proxies.libraries.bodyParser.json());

											server.route('/todo/get').get(get);
											server.route('/todo/new').put(create);
											server.route('/todo/update').post(update);
											server.route('/todo/delete').post(del);

											// Retrieve all todos
											function get(req, res, next) {
											  console.log(server_prefix + ' - Get called');
											  Todo.orderBy({index: "createdAt"}).run().then(function(result) {
											    res.send(JSON.stringify(result));
											  }).error(handleError(res));
											}

											// Create a new todo
											function create(req, res, next) {
											  console.log(server_prefix + ' - Create called');
											  var todo = new Todo(req.body);
											  todo.save().then(function(result) {
											    res.send(JSON.stringify(result));
											  }).error(handleError(res));
											}

											// Update a todo
											function update(req, res, next) {
											  console.log(server_prefix + ' - Update called');
											  var todo = new Todo(req.body);
											  Todo.get(todo.id).update({
											    title: req.body.title,
											    completed: req.body.completed
											  }).run().then(function(todo) {
											    res.send(JSON.stringify(todo));
											  }).error(handleError(res));

											  // Another way to update a todo is with
											  // Todo.get(req.body.id).update(todo).execute()
											}

											// Delete a todo
											function del(req, res, next) {
											  console.log(server_prefix + ' - Delete called');
											  Todo.get(req.body.id).run().then(function(todo) {
											    todo.delete().then(function(result) {
											      res.send("");
											    }).error(handleError(res));
											  }).error(handleError(res));

											  // Another way to delete a todo is with
											  // Todo.get(req.body.id).delete().execute()
											}

											function handleError(res) {
											  console.log(server_prefix + ' - handleError called');
											  return function(error) {
											    return res.send(500, {error: error.message});
											  }
											}

											// Start express
											server.listen(configurations.servers.express.port);
											console.log(server_prefix + ' - listening on port '+configurations.servers.express.port);

					                      }); // eof mappings(mapping)
									  }); // eof configurations(resource)


					        //      }); // eof resources(uuid)

				*/







}) // eof then configurationForUuid
.catch(function(error) {
  console.log('server - error: ', error);
}) // eof catch
.finally(function() {
  console.log('server - finally');
}); // eof finally
