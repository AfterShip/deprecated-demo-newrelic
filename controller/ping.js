var express = require('express');
var moment = require('moment');
var router = express.Router();
var request_count = 0;
var rps_start = 0;
var rps = 0;

var request = require('request');
var mongoose = require('mongoose');
var MyCar = mongoose.model('MyCar');

setInterval(function () {
	if (rps_start === 0) {
		rps_start = moment().valueOf();
		return;
	}

	var duration = (moment().valueOf() - rps_start) / 1000;
	if (duration <= 0) {
		return;
	}

	rps = request_count / duration;
	request_count = 0;
	rps_start = moment().valueOf();
}, 1000);

router.get('/', function (req, res) {
	res.render('ping', {});
});

router.get('/500', function (req, res) {
	throw new Error();
});

router.post('/', function (req, res) {
	request_count++;
	var req_start = moment().valueOf();
	
	if (rps > 15 && Math.random() < 0.3) {
		throw new Error();
	}

	if (req.body.mix === 'false') {
		console.log('simple');
		res.json({
			err: null,
			response_time: moment().valueOf() - req_start
		});
	} else {
		console.log('mix');
		// web external
		request({
			url: `http://www.google.com`,
			method: 'get'
		}, function(err, response, body){
			// redis
			var redis_key = Math.round(Math.random() * 10000);

			// set redis key
			req.app.redis.set(redis_key, 'test', 'EX', '60', function (err) {
				// get redis key
				req.app.redis.get(redis_key, function(err) {
					// mongodb add a car
					var my_car = new MyCar();
					my_car.name = moment().valueOf();
					my_car.save(function(err, saved_car) {
						// mongodb find the car
						MyCar.findById(saved_car.id, function(err, car) {
							res.json({
								err: null,
								response_time: moment().valueOf() - req_start
							});
						});
					});
				});
			});
		});
	}
});


module.exports = router;
