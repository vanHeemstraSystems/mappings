/*
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
var URI = require(path.join(paths.libraries, '/uri.js'));
var resource = {};
var scheme = 'urn'; // e.g. urn, url
var namespaceIdentifier = 'uuid'; // e.g. uuid, http, https
var namespaceSpecificString = '6e8bc430-9c3a-11d9-9669-0800200c9a66'; // e.g. 6e8bc430-9c3a-11d9-9669-0800200c9a66 or example.org/foo?bar=baz
var uri = new URI(scheme+':'+namespaceIdentifier+':'+namespaceSpecificString);
var configurations = require(path.join(paths.configurations, '/configurations.js')); // A function that returns a Promise
resource.URI = uri;

configurations(resource)
  .then(function(configurations) {
    //console.log('Server - configurations: ', configurations);

    var applications = configurations.applications;
    console.log('Server - applications: ', applications);

    var common = configurations.common;
    console.log('Server - common: ', common);

    var databases = configurations.databases;
    console.log('Server - databases: ', databases);

    var servers = configurations.servers;
    console.log('Server - servers: ', servers);   

	var server_prefix = common.server_prefix || 'PREFIX';
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

  });
