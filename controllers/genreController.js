
const mongoose = require('mongoose');
const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.genre_list = function(req,res,next) {
  // res.send('Not Implemented: genre List');
  Genre.find().sort([['name','ascending']]).
    exec(function(err,list_genre){
      if (err) { return next(err); }
      res.render('genre_list', {
        'title': 'Genre List',
        genre_list: list_genre
      });
    });
};

exports.genre_detail = function(req,res,next) {
  // res.send('Not Implemented: genre Detail');
  var id=mongoose.Types.ObjectId(req.params.id);
  async.parallel({
    genre:function(callback) {
      //Genre.findById(req.params.id).exec(callback);
      Genre.findById(id).exec(callback);
    },
    genre_books: function(callback) {
      // Book.find({'genre': req.params.id}).exec(callback);
      Book.find({'genre': id}).exec(callback);
    },
  },function(err,results){
      if (err) { return next(err); }
      // Note : When there is no entry for he given genre, then
      // it return empty result. It is not error return
      if (results.genre==null) {
        var err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      res.render('genre_detail',{
        title:'Genre Detail',
        genre: results.genre,
        genre_books: results.genre_books,
      });

  });
};

exports.genre_create_get = function(req,res,next) {
  //res.send('Not Implemented: genre Create Get');
  res.render('genre_form',{title: 'Create Genre'}); 
};

// Note: If defines array of middleware functions ( 3 of them ) 
exports.genre_create_post = [ 
  // res.send('Not Implemented: genre Create Post');

  // Validate that the name field is not emtpy
  body('name', 'Genre name required').isLength({min:1}).trim(),

  // Sanitize the name field
  sanitizeBody('name').trim().escape(),

  // process request
  (req,res,next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data
    var genre = new Genre({name: req.body.name});

    if (!errors.isEmpty()){
      res.render('genre_form',{
        title:'Create Genre',
        genre: genre,
        errors: errors.array()
      });
    }
    else {
      Genre.findOne({'name': req.body.name}).exec( function(err,found_genre) {
        if (err) { return next(err); }
        if (found_genre) { res.redirect(found_genre.url); }
        else {
          genre.save(function(err){
            if (err) { return next(err); }
            res.redirect(genre.url);
          });
        }
      });
    };
  }
];

exports.genre_delete_get = function(req,res,next) {
  // res.send('Not Implemented: genre delete get');
  async.parallel({
    genre: function(callback){
      Genre.findById(req.params.id).exec(callback);
    },
    genre_books: function(callback) {
      Book.find({'genre':req.params.id}).exec(callback);
    },
  },function(err,results){
      if (err) { return next(err); }
      if (results.genre==null) {
        res.redirect('/catalog/genres');
      }
      res.render('genre_delete',{
        title:'Delete Genre',
        genre: results.genre,
        genre_books: results.genre_books
      });
  });
};

exports.genre_delete_post = function(req,res,next) {
  // res.send('Not Implemented: genre delete post');
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.body.genreid).exec(callback);
    },
    genre_books: function(callback){
      Book.find({'genre':req.body.genreid}).exec(callback); 
    },
   },function(err,results){
      if (err) { return next(err); }
      if (results.genre_books.length>0){
        res.render('genre_delete',{
          title:'Delete Genre',
          genre: results.genre,
          genre_books: results.genre_books
        });
        return;
      }
     else {
       Genre.findByIdAndRemove(req.body.genreid,function(err){
         if (err) { return next(err); }
         res.redirect('/catalog/genres');
       });
       
     }
   });
};

exports.genre_update_get = function(req,res) {
  res.send('Not Implemented: genre update get');
};

exports.genre_update_post= function(req,res) {
  res.send('Not Implemented: genre update post');
};

