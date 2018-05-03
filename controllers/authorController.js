const async = require('async');
const mongoose = require('mongoose');
const Author = require('../models/author');
const Book = require('../models/book');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.author_list = function(req,res,next) {
  // res.send('Not Implemented: Author List');
  Author.find().sort([['family_name','ascending']]).
    exec(function(err,list_authors){
      if (err) { return next(err); }
      res.render('author_list', {
        'title': 'Author List',
        author_list: list_authors
      });
    });
};

exports.author_detail = function(req,res,next) {
  // res.send('Not Implemented: Author Detail');
  var id=mongoose.Types.ObjectId(req.params.id);
  async.parallel({
      author: function(callback) {
        Author.findById(id).exec(callback);
      },
      author_books: function(callback) {
        Book.find({'author':id},'title summary')
          .exec(callback);
      },
    },function(err,results){
        if (err) { return next(err); }
        if (results.author == null) {
          var err = new Error('Author not found');
          err.status = 404;
          return next(err);
        }
        res.render('author_detail', {
          title:'Author Detail',
          author:results.author,
          author_books: results.author_books
        });
    });
};

exports.author_create_get = function(req,res) {
  // res.send('Not Implemented: Author Create Get');
  res.render('author_form', { title: 'Create Author'});
};


// Note : This is array of 9 entries ( each entry is a function )
exports.author_create_post = [

  // Validate fields
  body('first_name').isLength({min:1}).trim().
    withMessage('First name must be specified').
    isAlphanumeric().
    withMessage('First name has non-alphanumeric characters.'),

  body('family_name').isLength({ min: 1 }).trim().
    withMessage('Family name must be specified.').
    isAlphanumeric().
    withMessage('Family name has non-alphanumeric characters.'),

  body('date_of_birth','Invalid date of birth').
    optional({ checkFalsy: true }).isISO8601(),
  body('date_of_death','Invalid date of death').
    optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fileds
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('data_of_birth').toDate(),
  sanitizeBody('data_of_death').toDate(),

  // Process Request after validation and sanitization
  (req,res,next) => {

    // Extract the validation errors from a request
    const errors = validationResult(res);

    if (!errors.isEmpty()) {
      res.render('author_form', {
        title: 'Create Author', 
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      var author=new Author( {
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      author.save(function(err){
        if (err) { return next(err); }
        res.redirect(author.url);
      });
    }
  }
];

exports.author_delete_get = function(req,res,next) {
  // res.send('Not Implemented: Author delete get');
  async.parallel({
    author: function(callback){
      Author.findById(req.params.id).exec(callback);
    },
    authors_books: function(callback) {
      Book.find({'author':req.params.id}).exec(callback);
    },
  },function(err,results){
      if (err) { return next(err); }
      if (results.author==null){
        res.redirect('/catalog/authors');
      }
      res.render('author_delete', {
        title: 'Delete Author',
        author:results.author,
        authors_books: results.authors_books,
      });
    
  });
};

exports.author_delete_post = function(req,res,next) {
  // res.send('Not Implemented: Author delete post');
  async.parallel({
    author: function(callback) {
      Author.findById(req.body.authorid).exec(callback);
    },
    authors_books: function(callback) {
      Book.find({'author':req.body.authorid}).exec(callback);
    }
  },function(err,results){
      if (err) { return next(err); }
      
      if (results.authors_books.length > 0) {
        // Author has books
        res.render('author_delete', {
          title:'Delete Author',
          author:results.author,
          author_books: results.authors_books,
        });
        return;
      }
      else {
        // Author has no books
        Author.findByIdAndRemove(req.body.authorid,function deleteAuthor(err){
          if (err) { return next(err); }
          res.redirect('/catalog/authors');
        });
      }
  });
};

exports.author_update_get = function(req,res) {
  res.send('Not Implemented: Author update get');
};
exports.author_update_post= function(req,res) {
  res.send('Not Implemented: Author update post');
};

