"use strict";

var util = require('util');
var errors = module.exports = {};

/**
 * The base error that all Mapping (WAS thinky) related errors derive from
 *
 * @constructor
 * @alias Error
 */
//WAS errors.ThinkyError = function() {
errors.MappingError = function() {
  var tmp = Error.apply(this, arguments);
  tmp.name = this.name = 'MappingError'; //WAS 'ThinkyError';

  this.message = tmp.message;
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.MappingError, Error); //WAS util.inherits(errors.ThinkyError, Error);

/**
 * Thrown or returned when `get` returns `null`.
 * @extends MappingError //WAS ThinkyError
 */
errors.DocumentNotFound = function(message) {
  var errorMessage = message || "The query did not find a document and returned null.";
  errors.MappingError.call(this, errorMessage); //WAS errors.ThinkyError.call(this, errorMessage);
  this.name = 'DocumentNotFoundError';
};
util.inherits(errors.DocumentNotFound, errors.MappingError);//WAS util.inherits(errors.DocumentNotFound, errors.ThinkyError);

/**
 * Thrown or returned when an in place update/replace returns an invalid document.
 * @extends MappingError //WAS ThinkyError
 */
errors.InvalidWrite = function(message, raw) {
  errors.MappingError.call(this, message); //WAS errors.ThinkyError.call(this, message);
  this.name = 'InvalidWriteError';
  this.raw = raw;
};
util.inherits(errors.InvalidWrite, errors.MappingError); //WAS util.inherits(errors.InvalidWrite, errors.ThinkyError);

/**
 * Thrown or returned when validation of a document fails.
 * @extends MappingError //WAS ThinkyError
 */
errors.ValidationError = function(message) {
  errors.MappingError.call(this, message); //WAS errors.ThinkyError.call(this, message);
  this.name = 'ValidationError';
};
util.inherits(errors.ValidationError, errors.MappingError); //WAS util.inherits(errors.ValidationError, errors.ThinkyError);

/**
 * Thrown or returned when the primary key unique document constraint fails.
 * @extends MappingError //WAS ThinkyError
 */
errors.DuplicatePrimaryKey = function(message, primaryKey) {
  errors.MappingError.call(this, message); //WAS errors.ThinkyError.call(this, message);
  this.name = 'DuplicatePrimaryKeyError';
  if (primaryKey !== undefined) {
    this.primaryKey = primaryKey;
  }
};
util.inherits(errors.DuplicatePrimaryKey, errors.MappingError); //WAS util.inherits(errors.DuplicatePrimaryKey, errors.ThinkyError);

/**
 * regular expressions used to determine which errors should be thrown
 */
errors.DOCUMENT_NOT_FOUND_REGEX = new RegExp('^The query did not find a document and returned null.*');
errors.DUPLICATE_PRIMARY_KEY_REGEX = new RegExp('^Duplicate primary key `(.*)`.*');

/**
 * Creates an appropriate error given either an instance of Error or a message
 * from the RethinkDB driver
 */
errors.create = function(errorOrMessage) {
  var message = (errorOrMessage instanceof Error) ? errorOrMessage.message : errorOrMessage;
  if (message.match(errors.DOCUMENT_NOT_FOUND_REGEX)) {
    return new errors.DocumentNotFound(message);
  } else if (message.match(errors.DUPLICATE_PRIMARY_KEY_REGEX)) {
    var primaryKey = message.match(errors.DUPLICATE_PRIMARY_KEY_REGEX)[1];
    return new errors.DuplicatePrimaryKey(message, primaryKey);
  } else if (errorOrMessage instanceof Error) {
    return errorOrMessage;
  }

  return new errors.MappingError(errorOrMessage); //WAS errors.ThinkyError(errorOrMessage);
};
