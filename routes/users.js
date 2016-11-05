var express = require('express');
var router = express.Router();

//refer to the games model
var Account = require('../models/account');

//auth check
function isLoggedIn(req, res, next)
{
  if (req.isAuthenticated())
  {
    next();
  }
  else
  {
    res.redirect('/login');
  }
}

router.get('/', isLoggedIn, function(req,res,next)
{
  //use the account model to run a quere
  Account.find(function(err, users)
  {
    if (err)
    {
      console.log(err);
      res.render('error');
    }
    else
    {
      //load the user view
      res.render('users',
          {
            title: 'Users',
            users: users,
            user: req.user
          });
    }
  });

});
module.exports = router;
