var express = require('express');
var router = express.Router();
var session = require('express-session');
var crypto = require('crypto');

var passport = require('passport');
var local = require('passport-local').Strategy;


var User  = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.get('/register', function(req, res, next) {
  res.render('register',{
   'title':'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
   'title':'Login'
  });
});

var username='';

router.post('/register',function(req,res,next){
   console.log(req.body.name);
   var name = req.body.name;
   var email = req.body.email;
    username = req.body.username;
   var password = req.body.password;
   var password2 = req.body.password2;

	//check for image field
	if(req.file){
		console.log('file uploading...........');
		var profileimageoriginalname = req.files.profileimage.originalname;
		var profileimagename  = req.files.profileimage.name;
		var profileimagemime  = req.files.profileimage.mimetype;
		var profileimagepath  = req.files.profileimage.path;
		var profileimageext  = req.files.profileimage.extension;
		var profileimagesize  = req.files.profileimage.size;
	}
	else{
		//set a default image
		var profileimageoriginalname = 'noimage.png';
	}

	//for validation
	req.checkBody('name','Name Field is required').notEmpty();
	req.checkBody('email','email not valid').isEmail();
	req.checkBody('username','username Field is required').notEmpty();
	req.checkBody('password','password Field is required').notEmpty();
	req.checkBody('password2','password not matched').equals(req.body.password);
    
    var errors = req.validationErrors();

    if(errors){
    	console.log(errors);
    	res.render('register',{errors:errors,name:name,email:email,username:username,password:password,password2:password2});
    }
    else{
    	console.log('no errors');
    	var newUser = new User({
           name:name,email:email,username:username,password:password,password2:password2,profileimage:profileimagename
    	});
    
        req.flash('success','you are registered and can now login');

	    User.createUser(newUser,function(err,user){
	          if(err) throw err;
	          console.log(user);
	    });


	    res.location('/');
	    res.redirect('/');
    }

});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new local(
     function(username,password,done){
         User.findOne({username:username},function(err,user){
             if(err) throw err;
             if(!user){
             	console.log('unknown user');
             	return done(null,false,{message:'unknown user'});
             }
             User.comparePassword(password,user.password,function(err,isMatch){
             	if (err) throw err;
             	if(isMatch) {
                    return done(null,user);
             	}else{
             		console.log('Invalid password');
             	    return done(null,false,{message:'Invalid password'});
             	}
             });
         });
     }
));

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid username and passsword'}),function(req,res){
    console.log('authenticate success.......');
   

    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var token  =crypto.createHash('sha1').update(current_date + random).digest('hex');

    express().use(session({
      logintoken: token,
      typeName: 'session',       // optional
      pingInterval: 1000,        // optional
      timeout: 10000             // optional
    }));

    req.flash('success broooo.........','you are logged In');
    res.redirect('/');
});

router.get('/logout',function(req,res){
   req.logout();
   req.flash('success','You have logged Out');
   res.redirect('/users/login');
});


module.exports = router;
