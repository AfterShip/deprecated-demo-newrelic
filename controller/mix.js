var express = require('express');
var moment = require('moment');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var MyCar = mongoose.model('MyCar');

router.get('/', function (req, res) {
	var req_start = moment().valueOf();

	var render = function(err) {
		var result = 'No error';
		if (err) {
			result = 'Error: ' + err.message;
		}

		var time_consumed = moment().valueOf() - req_start;
		res.render('mix', {
			time_consumed: time_consumed,
			result: result
		});
	};


	// web external
	request({
		url: `http://slowwly.robertomurray.co.uk/delay/${Math.random() * 2000 + 1000}/url/http://www.google.com`,
		method: 'get'
	}, function(err, response, body){
		// redis
		var redis_key = Math.round(Math.random() * 10000);

		// set redis key
		req.app.redis.set(redis_key, 'test', 'EX', '60', function (err) {
			if (err) {
				render(err);
				return;
			}

			// get redis key
			req.app.redis.get(redis_key, function(err) {
				if (err) {
					render(err);
					return;
				}

				// mongodb add a car
				var my_car = new MyCar();
				my_car.name = moment().valueOf();
				my_car.save(function(err, saved_car) {
					if (err) {
						render(err);
						return;
					}

					// mongodb find the car
					MyCar.findById(saved_car.id, function(err, car) {
						if (err) {
							render(err);
							return;
						}

						render();
					});
				});
			});
		});
	});
});

module.exports = router;
