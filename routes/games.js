/**
 * Created by Lee_G on 2016-10-06.
 */
var express = require('express');
var router = express.Router();

//refer to the games model
var Game = require('../models/game');

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

//GET handler for /games
router.get('/', isLoggedIn, function(req,res,next)
{
    //use the game model to run a quere
    Game.find(function(err, games)
    {
       if (err)
       {
           console.log(err);
           res.render('error');
       }
       else
       {
           //load the games view
           res.render('games',
               {
                   title: 'Video Games',
                   games: games,
                   user: req.user
               });
       }
    });

});

/* GET /games/add - display empty game form*/
router.get('/add', isLoggedIn, function(req,res,next)
{
    res.render('add-game',
        {
            title: 'Add a New Game',
            user: req.user
        })
});

/* POST /games/add - process form submission */
router.post('/add', isLoggedIn, function(req, res, next)
{
    //use the Game model and call the Mongoose create function
    Game.create({
        title: req.body.title,
        publisher: req.body.publisher,
        genre: req.body.genre,
        year: req.body.year
    }, function(err, Game)
    {
        if(err) {
            console.log(err);
            res.render('error')
        }
        else
        {
            res.redirect('/games');
        }
    });
});

/* GET /games/delete/:_id*/
router.get('/delete/:_id', isLoggedIn, function(req, res, next) {
    // read the id value from the url
    var _id = req.params._id;

    // use mongoose to delete this game
    Game.remove( { _id: _id }, function(err) {
        if (err) {
            console.log(err);
            res.render('error', {message: 'Delete Error'});
        }
        res.redirect('/games');
    });
});

/* GET /games/edit - display \game form*/
router.get('/:_id', function(req,res,next)
{
    //get the id from the url
    var _id = req.params._id;

    //look up the selected Game document with this _id
    Game.findById(_id, function(err, game)
    {
        if(err)
        {
            console.log(err);
            res.render('error', {message: 'item ID not found'});
        }
        else
        {
            res.render('edit-game',
                {
                    title: 'Edit a game',
                    game: game,
                    user: req.user
                });
        }
    });

});

/*POST /games/_:id - save form to process Game updates */
router.post('/:_id', isLoggedIn, function(req,res,next)
{
    //get the id from the url
    var _id=req.params._id;

    //instantiate a new game oject and populate it from the form
    var game = new Game({
        _id: _id,
        title: req.body.title,
        publisher: req.body.publisher,
        genre: req.body.genre,
        year: req.body.year
    });

    //save the update using mongoose
    Game.update( {_id: _id }, game, function(err)
    {
        if(err)
        {
            console.log(err);
            res.render('error', {message: 'Could not update item'});
        }
        else
        {
            res.redirect('/games');
        }
    })
});

//make controller public
module.exports = router;
