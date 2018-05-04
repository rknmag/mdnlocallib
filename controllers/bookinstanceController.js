
const async = require('async');
const mongoose = require('mongoose');
const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.bookinstance_list = function(req,res,next) {
  // res.send('Not Implemented: bookinstance List');
  BookInstance.find().
    populate('book').
    exec(function(err,list_bookinstances){
      if (err) { return next(err); }
      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: list_bookinstances
      });
    });
};

exports.bookinstance_detail = function(req,res,next) {
  var id=mongoose.Types.ObjectId(req.params.id);
  BookInstance.findById(id).populate('book').exec(function(err,bookinstance){
    if (err) { return next(err); }
    if (bookinstance == null) {
      var err = new Error('Book copy not found')
      err.status = 404;
      return next(err);
    };
    res.render('bookinstance_detail', {
      title: 'Book',
      bookinstance: bookinstance,
    });
  });
};

exports.bookinstance_create_get = function(req,res,next) {
  Book.find({},'title').exec(function(err,books){
    if (err) { return next(err); }
    res.render('bookinstance_form', { 
      title: 'Create BookInstance',
      book_list: books
    });
  });
};

exports.bookinstance_create_post = [

  // Validate fileds
  body('book', 'Book must be specified').isLength({min:1}).trim(),
  body('imprint', 'Imprint must be specified').isLength({min:1}).trim(),
  body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),

  // Sanitize fields
  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  // Process request after validation and sanitization
  (req,res,next) => {
    //Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data
    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()){
      Book.find({},'title').exec(function(err,books){
        if (err) { return next(err); }
        res.render('bookinstance_form', {
          title:'Create BookInstance',
          book_list: books,
          selected_book: bookinstance.book._id,
          bookinstance: bookinstance,
          errors:errors.array(),
        });
      });
      return;
    }
    else {
      bookinstance.save(function(err){
        if (err) { return next(err); }
        res.redirect(bookinstance.url);
      });
    }
  }
];

exports.bookinstance_delete_get = function(req,res,next) {
  // res.send('Not Implemented: bookinstance delete get');
  var id=mongoose.Types.ObjectId(req.params.id);
  BookInstance.findById(id).populate('book').exec(function(err,bookinstance){
    if (err) { return next(err); }
    if (bookinstance.book == null) {
      res.redirect('/catalog/bookinstances');
    }
    res.render('bookinstance_delete',{
      title: 'Delete BookInstance',
      bookinstance: bookinstance
    });
  });
};

exports.bookinstance_delete_post = function(req,res,next) {
  // res.send('Not Implemented: bookinstance delete post');
  let id=mongoose.Types.ObjectId(req.params.id);
  BookInstance.findByIdAndRemove(id, function(err){
    if (err) { return next(err); }
    res.redirect('/catalog/bookinstances');
  });
};

exports.bookinstance_update_get = function(req,res,next) {
  // res.send('Not Implemented: bookinstance update get');

  let id=mongoose.Types.ObjectId(req.params.id);
  async.parallel({
    book_list : function(callback) { Book.find().exec(callback); },
    bookinstance: function(callback) {
      BookInstance.findById(id).populate('book').exec(callback); },
  },function(err,results){
      if (err) { return next(err); }
      if (results.bookinstance==null) {
        let err = new Error('Book Instance not found');
        err.status=404;
        return next(err);
      }
      res.render('bookinstance_form', {
        title: 'Update Book Instance',
        book_list: results.book_list,
        bookinstance: results.bookinstance
    });
  });
};


exports.bookinstance_update_post = [

  // Validate fileds
  body('book', 'Book must be specified').isLength({min:1}).trim(),
  body('imprint', 'Imprint must be specified').isLength({min:1}).trim(),
  body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),

  // Sanitize fields
  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  // Process request after validation and sanitization
  (req,res,next) => {
    //Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data
    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id   : req.params.id // This is required, else new id will be assigend
    });

    if (!errors.isEmpty()){
      Book.find({},'title').exec(function(err,books){
        if (err) { return next(err); }
        res.render('bookinstance_form', {
          title:'Create BookInstance',
          book_list: books,
          selected_book: bookinstance.book._id,
          bookinstance: bookinstance,
          errors:errors.array(),
        });
      });
      return;
    }
    else {
      BookInstance.findByIdAndUpdate(req.params.id,bookinstance,{}, function(err,thebookinstance){
        if (err) { return next(err); }
        res.redirect(thebookinstance.url);
      });
    }
  }
];

