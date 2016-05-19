var express = require('express');
var router = express.Router();

var moment = require('moment');

var mongoose = require('mongoose');
var MyCar = mongoose.model('MyCar');


router.get('/', function (req, res) {
	var my_car = new MyCar();
	my_car.name = moment().valueOf();
	my_car.save(function(err) {
		var result = 'No error';
		if (err) {
			result = 'Error: ' + err.message;
		}
		res.render('mongodb', {
			result: result
		});
	});
});



router.get('/error', function (req, res) {
	MyCar.findById('invalid_id', function(err, data) {
		var result = 'No error';
		if (err) {
			result = 'Error: ' + err.message;
		}
		res.render('mongodb', {
			result: result
		});
	});
});

module.exports = router;
