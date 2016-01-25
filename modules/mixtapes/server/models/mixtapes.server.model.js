'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Mixtapes Schema
 */
var MixtapeSchema = new Schema({
	tracks: [String]
});

mongoose.model('Mixtape', MixtapeSchema);
