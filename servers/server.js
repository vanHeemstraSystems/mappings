/*
 * Following the example from https://github.com/neumino/thinky
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
var Mapping = Mappings.mapping(config.databases.rethinkdb);// call the 'rethinkdb' mapping, providing it with the config for rethinkdb
console.log(server_prefix + ' - Mapping: ', Mapping);

var r = Mapping.r;
console.log(server_prefix + ' - r: ', r);

var type = Mapping.type;
console.log(server_prefix + ' - type: ', type);

// Create a model - the table is automatically created
var Post = Mapping.createModel("Post", {
  id: String,
  title: String,
  content: String,
  idAuthor: String
}); 
console.log(server_prefix + ' - Post: ', Post);

// You can also add constraints on the schema
var Author = Mapping.createModel("Author", {
  id: type.string(),      // a normal string
  name: type.string().min(2),  // a string of at least two characters
  email: type.string().email()  // a string that is a valid email
});
console.log(server_prefix + ' - Author: ', Author);

// Join the models
Post.belongsTo(Author, "author", "idAuthor", "id");

// Save a new post with its author.

// Create a new post
var post = new Post({
  title: "Hello World!",
  content: "This is an example."
});
console.log(server_prefix + ' - post: ', post);

// Create a new author
var author = new Author({
  name: "Michel",
  email: "orphee@gmail.com"
});
console.log(server_prefix + ' - author: ', author);

// Join the documents
post.author = author;

post.saveAll().then(function(result) {
  /*
  post = result = {
    id: "0e4a6f6f-cc0c-4aa5-951a-fcfc480dd05a",
    title: "Hello World!",
    content: "This is an example.",
    idAuthor: "3851d8b4-5358-43f2-ba23-f4d481358901",
    author: {
      id: "3851d8b4-5358-43f2-ba23-f4d481358901",
      name: "Michel",
      email: "orphee@gmail.com"
    }
  }
  */
});

// Retrieve the post with its author.

Post.get("0e4a6f6f-cc0c-4aa5-951a-fcfc480dd05a").getJoin().run().then(function(result) {
  /*
  result = {
    id: "0e4a6f6f-cc0c-4aa5-951a-fcfc480dd05a",
    title: "Hello World!",
    content: "This is an example.",
    idAuthor: "3851d8b4-5358-43f2-ba23-f4d481358901",
    author: {
      id: "3851d8b4-5358-43f2-ba23-f4d481358901",
      name: "Michel",
      email: "orphee@gmail.com"
    }
  }
  */
});