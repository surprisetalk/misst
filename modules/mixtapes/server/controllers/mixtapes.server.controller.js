'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash');

var Mixtape = mongoose.model('Mixtape');

/**
 * Parses the server side errors and sends a helpful response.
 */
var checkAndHandleServerError = function (err, res, responseJson) {
	if (err) {
		console.log(err);

		// TODO - Parse err obj and send proper response to client.
		responseJson.error = err;
		res.status(500).json(responseJson);
		return true;
	}
	return false;
};

/**
 * Checks if the given mixtape is null. If so, responds with error
 * message.
 */
var checkAndHandleNullTape = function (tape, res, responseJson) {
	if (tape === null) {
		responseJson.error = 'No mixtape with given id';
		res.status(400).json(responseJson);
		return true;
	}
	return false;
};

/**
 * Checks if the given index is less than the given maxValue. If so, responds
 * with error message.
 */
var checkAndHandleHighIndex = function (index, maxValue, res, responseJson) {
	if (index > maxValue) {
		responseJson.error = '"index" is out of range';
		res.status(400).json(responseJson);
		return true;
	}
	return false;
};

/**
 * Checks if the given index is less than 0. If so, responds with error
 * message.
 */
var checkAndHandleLowIndex = function (index, res, responseJson) {
	if (index < 0) {
		responseJson.error = '"index" must be greater than or equal to 0';
		res.status(400).json(responseJson);
		return true;
	}
	return false;
};

/**
 * Checks if the given parameter is undefined. If so, responds with error
 * message.
 */
var checkAndHandleUndefinedParameter = function (param, paramName, res, responseJson) {
	if (param === undefined) {
		responseJson.error = '"' + paramName + '"" is a required parameter';
		res.status(400).json(responseJson);
		return true;
	}
	return false;
};

/**
 * Creates a new instance of a Mixtape and responds with the id of said
 * Mixtape.
 */
exports.create = function (req, res) {
	var tape = new Mixtape(),
		responseJson = {
			mixtapeId: null
		};

	tape.save(function onTapeSave (err, tape) {
		if (checkAndHandleServerError(err, res, responseJson)) return;

		responseJson.mixtapeId = tape.id;
		res.json(responseJson);
	});
};

/**
 * Retreives an instance of a Mixtape by its id and responds to the client
 * with said Mixtape.
 */
exports.read = function (req, res) {
	var id = req.params.id,
		responseJson = {
			mixtapeId: id,
			tracks: null
		};

	Mixtape.findById(id, function onTapeFind (err, tape) {
		if (checkAndHandleServerError(err, res, responseJson)) return;
		if (checkAndHandleNullTape(tape, res, responseJson)) return;

		responseJson.tracks = tape.tracks;
		res.json(responseJson);
	});
};

/**
 * Inserts a track into the Mixtape with the given id and then responds
 * with the index of insertion. If an index is given by the client then insert
 * the track there, otherwise insert at the end.
 */
exports.insertTrack = function (req, res) {
	var id = req.params.id,
		appendToEnd = false,
		responseJson = {
			mixtapeId: id,
			newTrack: null,
			newTrackIndex: null
		};

	// Check link
	// link must be included.
	var link = req.body.link;
	if (checkAndHandleUndefinedParameter(link, 'link', res, responseJson)) return;
	responseJson.newTrack = link;

	// Check index
	// URL parameter gets priority.
	// If included, index must be greater than 0.
	var index,
		reqIndex = req.params.index,
		bodyIndex = req.body.index;

	if (reqIndex !== undefined || bodyIndex !== undefined) {
		index = reqIndex || bodyIndex;
		responseJson.newTrackIndex = index;

		if (checkAndHandleLowIndex(index, res, responseJson)) return;
	}
	else {
		// No index was included so we default to appending to the end of the
		// tracks list.
		appendToEnd = true;
	}

	// Start query
	Mixtape.findById(id, function onTapeFind (err, tape) {
		if (checkAndHandleServerError(err, res, responseJson)) return;
		if (checkAndHandleNullTape(tape, res, responseJson)) return;

		var length = tape.tracks.length;

		if (appendToEnd) {
			index = length;
			responseJson.newTrackIndex = index;
		}

		if (checkAndHandleHighIndex(index, length, res, responseJson)) return;

		tape.tracks.splice(index, 0, link);
		tape.save(function onTapeSave (err) {
			if (checkAndHandleServerError(err, res, responseJson)) return;

			res.json(responseJson);
		});
	});
};

/**
 * Removes the track at the given index from the Mixtape with the
 * given id and responds with the new number of tracks.
 */
exports.removeTrack = function (req, res) {
	var id = req.params.id,
		index = req.params.index,
		responseJson = {
			mixtapeId: id,
			removedTrackIndex: index,
			newNumberOfTracks: null
		};

	if (checkAndHandleLowIndex(index, res, responseJson)) return;

	Mixtape.findById(id, function onTapeFind (err, tape) {
		if (checkAndHandleServerError(err, res, responseJson)) return;
		if (checkAndHandleNullTape(tape, res, responseJson)) return;

		var length = tape.tracks.length;

		if (checkAndHandleHighIndex(index, length-1, res, responseJson)) return;

		tape.tracks.splice(index, 1);
		tape.save(function onTapeSave (err) {
			if (checkAndHandleServerError(err, res, responseJson)) return;

			responseJson.newNumberOfTracks = tape.tracks.length;

			res.json(responseJson);
		});
	});
};
