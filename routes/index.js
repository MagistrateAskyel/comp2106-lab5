var express = require('express');
var router = express.Router();

//link to the Account model
var Account = require('../models/account');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lab 5 - Passport Authentication',
  message: 'In this lab I added a new data-driven page to my in-class MEAN application and control access to my new page',
  user: req.user});
});

/*GET register page*/
router.get('/register', function(req,res,next) {
  res.render('register', {title: 'Register', user: req.user})
});

/* Post register page */
router.post('/register', function(req, res, next){
  //use passport and the Account module to save the user
  Account.register(new Account( {username: req.body.username}), req.body.password, function(err, account){
    if (err) {
      console.log(err);
      res.render('error');
    }
    else
    {
      res.redirect('/login');
    }
  });
});
/*GET login page*/
router.get('/login', function(req,res,next) {
    var messages = req.session.messages || [];
  res.render('login', {
    title: 'Login',
    messages: messages,
      user: req.user});
    req.session.messages = null;
});

//clear the messages out
var messages = [];

/*POST login page*/
router.post('/login', passport.authenticate('local', {
    successRedirect: '/games',
    failureRedirect: '/login',
    failureMessage: 'Invaild Login' //stored in session.messages
}));

/* GET logout */
router.get('/logout', function(req,res,next){
    req.logout();
    res.redirect('/login')
});
module.exports = router;
