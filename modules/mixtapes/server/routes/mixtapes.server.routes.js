'use strict';

var controller = require('../controllers/mixtapes.server.controller');

module.exports = function(app) {
	app.post('/mixtape', function (req, res) {
		controller.create(req, res);
	});

	app.get('/mixtape/:id', function (req, res) {
		controller.read(req, res);
	});

	app.post('/mixtape/:id', function (req, res) {
		controller.insertTrack(req, res);
	});

	app.post('/mixtape/:id/:index', function (req, res) {
		controller.insertTrack(req, res);
	});

	app.delete('/mixtape/:id/:index', function (req, res) {
		controller.removeTrack(req, res);
	});
};
