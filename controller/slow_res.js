var express = require('express');
var moment = require('moment');
var request = require('request');
var router = express.Router();

router.get('/', function (req, res) {
	var req_start = moment().valueOf();
	request({
		url: `http://slowwly.robertomurray.co.uk/delay/${Math.random() * 2000 + 1000}/url/http://www.google.com`,
		method: 'get'
	}, function(err, response, body){
		var time_consumed = moment().valueOf() - req_start;
		res.render('slow_res', {
			time_consumed: time_consumed
		});
	})
});

module.exports = router;
