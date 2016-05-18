var express = require('express');
var moment = require('moment');
var request = require('request');
var router = express.Router();
var request_count = 0;
var rps_start = 0;
var rps = 0;

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

	if (rps > 15 && Math.random() < 0.3) {
		throw new Error();
	}

	res.json({
		err: null
	});
});

router.get('/external', function (req, res) {
	request({
		url: 'http://localhost:8002/ping/external-response',
		method: 'get'
	}, function(err, response, body){
		res.json({
			err: null
		});
	})
});


router.get('/external-response', function (req, res) {
	setTimeout(function() {
		res.json({
			err: null
		});
	}, Math.random() * 2000 + 1000);
});

module.exports = router;
