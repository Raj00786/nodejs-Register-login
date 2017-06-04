var express = require('express');
var session = require('express-session');

var router = express.Router();

/* GET home page. */
router.get('/', authenticated,function(req, res, next) {
  res.render('index', { title: 'Express' });
});


function authenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
