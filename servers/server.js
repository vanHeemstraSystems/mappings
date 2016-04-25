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
			//return o;
			// now we have the object o
            console.log('server - object: ', o);
            var uuid = o.uuid;
            console.log('server - uuid: ', uuid);
			// Get a resource, by providing its uuid
            console.log('server - resource: ', proxies.proxy().resources().resource); // function () { return new ResourcesResource(); }

            console.log('server - proxies.proxy().resources().resource(): ', proxies.proxy().resources().resource());  // Resource {}

            console.log('server - proxies.proxy().resources().resource()._6e8bc430_9c3a_11d9_9669_0800200c9a66: ', proxies.proxy().resources().resource()._6e8bc430_9c3a_11d9_9669_0800200c9a66);

            console.log('server - proxies.proxy().resources().resource()._6e8bc430_9c3a_11d9_9669_0800200c9a66(): ', proxies.proxy().resources().resource()._6e8bc430_9c3a_11d9_9669_0800200c9a66());


						//	var resources = require(path.join(paths.resources, '/resources.js')); // A function that returns a Promise
					    //    console.log('Server - resources: ', resources);

				            //join(resources(uuid), function(resources) {
//				            join(_Me.proxies.resources(uuid), function(resources) {
//				              console.log('server - resources: ', resources);
//				              _Me.proxies.resources.resource = resources.resource;
//				              console.log('server - resource: ', _Me.proxies.resources.resource);
//				              return(_Me);
//				            }) // eof join proxies
				/*
						//	resources(uuid)
						//	.then(function(resources) {
						//	  resource = resources.resource;
						//	  console.log('Server - resource: ', resource);
				*/
//				            .then(function(_Me) {
//					          return(
//					            join(_Me.proxies.configurations(_Me.proxies.resources.resource), function(configurations) {
//					              //configurations.common.server_prefix = configurations.common.server_prefix || 'PREFIX';
//						          //console.log(server_prefix + ' - configurations: ', configurations);
//								  console.log('server - configurations: ', configurations);
//							      _Me.proxies.configurations.configurations = configurations;
//				                  return(_Me);
//					            }) // eof join
//					            .catch(function(error) {
//				                  console.log('server - error: ', error);
//				                }) // eof catch
//				              ); // eof return
//				            }) //eof then configurations
				/*            
							  var configurations = require(path.join(paths.configurations, '/configurations.js')); // A function that returns a Promise
							  configurations(resource)
							  .then(function(configurations) {  
				                var server_prefix = configurations.common.server_prefix || 'PREFIX';
								console.log(server_prefix + ' - configurations: ', configurations);
				*/
//				            .then(function(_Me) {
//				              return(
//				              	join(_Me.proxies.libraries.express(), function(server) {
//				              	  console.log('server - server: ', server);
//				                  _Me.server = server;
//				              	  return(_Me)
//				                }) // eof join
//					            .catch(function(error) {
//				                  console.log('server - error: ', error);
//				                }) // eof catch                
//				              ); // eof return
//				            }) // eof then server
				/*

								var server = _Me.proxies.libraries.express();

				*/
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
}) // eof then
.catch(function(error) {
  console.log('server - error: ', error);
}) // eof catch
.finally(function() {
  console.log('server - finally');
}); // eof finally
