/*
 * Following the example from https://github.com/neumino/thinky/examples/basic-todo
 * but with our own modifications (removal of 'thinky' and 'rethinkdbdash')
 */

// Import express and co
var path = require('../../libraries/path');
var paths = require('../../paths/paths');
var express = require(path.join(paths.libraries, '/express.js'));
var bodyParser = require(path.join(paths.libraries, '/body-parser.js'));
var config = require(path.join(paths.configurations, '/configurations.js'))();// call it
var common = config.common,
server_prefix = common.server_prefix || 'PREFIX';
console.log(server_prefix + ' - config: ', config);

var app = express();

// Import mappings
var Mappings = require(__dirname+'/../mappings.js')('RethinkDB'); // here we specify that we want the 'rethinkdb' mapping
console.log(server_prefix + ' - Mappings: ', Mappings);

// Call RethinkDB mapping
console.log(server_prefix + ' - config.databases.rethinkdb: ', config.databases.rethinkdb);

// NOTE: 'thinky' is from here on 'Mapping'

var Mapping = Mappings.mapping(config.databases.rethinkdb);// call the 'rethinkdb' mapping, providing it with the config for rethinkdb
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

app.use(express.static(__dirname + '/public'));
//DEPRECATED app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.route('/todo/get').get(get);
app.route('/todo/new').put(create);
app.route('/todo/update').post(update);
app.route('/todo/delete').post(del);

// Retrieve all todos
function get(req, res, next) {
  Todo.orderBy({index: "createdAt"}).run().then(function(result) {
    res.send(JSON.stringify(result));
  }).error(handleError(res));
}

// Create a new todo
function create(req, res, next) {
  var todo = new Todo(req.body);
  todo.save().then(function(result) {
    res.send(JSON.stringify(result));
  }).error(handleError(res));
}

// Update a todo
function update(req, res, next) {
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
  Todo.get(req.body.id).run().then(function(todo) {
    todo.delete().then(function(result) {
      res.send("");
    }).error(handleError(res));
  }).error(handleError(res));

  // Another way to delete a todo is with
  // Todo.get(req.body.id).delete().execute()
}

function handleError(res) {
  return function(error) {
    return res.send(500, {error: error.message});
  }
}

// Start express
app.listen(config.servers.express.port);
console.log('listening on port '+config.servers.express.port);
