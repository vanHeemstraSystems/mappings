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

// Import express and co
var path = require('../../libraries/path');
var paths = require('../../paths/paths');
var express = require(path.join(paths.libraries, '/express.js'));
var bodyParser = require(path.join(paths.libraries, '/body-parser.js'));
var Promise = require(path.join(paths.libraries, '/bluebird.js'));
var resource = {}; // placeholder

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
            console.log('Server - additional command: ', val);
            try {
		        var o = JSON.parse(val);
		        // Handle non-exception-throwing cases:
		        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
		        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
		        // so we must check for that, too.
		        if (o && typeof o === "object" && o !== null) {
		            //return o;
		            // now we have the object o
		            console.log('Server - object: ', o);
		            var uuid = o.uuid;
		            console.log('Server - uuid: ', uuid);
					// Get a resource, by providing its uuid
					var resources = require(path.join(paths.resources, '/resources.js')); // A function that returns a Promise
                    console.log('Server - resources: ', resources);
					resources(uuid)
					  .then(function(resources) {
					    resource = resources.resource;
					    console.log('Server - resource: ', resource);
						var configurations = require(path.join(paths.configurations, '/configurations.js')); // A function that returns a Promise
						configurations(resource)
						  .then(function(configurations) {  

							var server_prefix = configurations.common.server_prefix || 'PREFIX';
							console.log(server_prefix + ' - configurations: ', configurations);

							var server = express();

							// Import mappings
							var Mappings = require(__dirname+'/../mappings.js')('RethinkDB'); // here we specify that we want the 'rethinkdb' mapping
							console.log(server_prefix + ' - Mappings: ', Mappings);

							// Call RethinkDB mapping
							console.log(server_prefix + ' - configurations.databases.rethinkdb: ', configurations.databases.rethinkdb);

							// NOTE: 'thinky' is from here on 'Mapping'

							var Mapping = Mappings.mapping(configurations.databases.rethinkdb);// call the 'rethinkdb' mapping, providing it with the config for rethinkdb
							console.log(server_prefix + ' - Mapping: ', Mapping);

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

							server.use(express.static(__dirname + '/../publications'));
							//DEPRECATED server.use(bodyParser());
							server.use(bodyParser.urlencoded({
							  extended: true
							}));
							server.use(bodyParser.json());

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

						  }); // eof configurations(resource)
                      }); // eof resources(uuid)
		        }
		    }
		    catch (e) { 
              console.log('Server - error: ', e);
		    }
  	        break; // eof case 2
  	default:
  	        // do nothing
  	        break;
  }
});
