var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	req.app.redis.set(Math.round(Math.random() * 10000), 'test', 'EX', '60', function (err) {
		var result = 'No error';
		if (err) {
			result = 'Error: ' + err.message;
		}
		res.render('redis', {
			result: result
		});
	});
});

router.get('/error', function (req, res) {
	req.app.redis.set(Math.round(Math.random() * 10000), function (err) {
		var result = 'No error';
		if (err) {
			result = 'Error: ' + err.message;
		}
		res.render('redis', {
			result: result
		});
	});
});

module.exports = router;
