var express = require('express');
var router = express.Router();

// Require all controller Modules
var book_controller   = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var bookinstance_controller = 
  require('../controllers/bookinstanceController');

// Book Routers

router.get('/', book_controller.index);
/*
router.get('/', (req,res)=>{
  res.send('Reached catalog.js');
});
*/

// Note: This must come before /book/:id route 
router.get('/book/create',book_controller.book_create_get);
router.post('/book/create',book_controller.book_create_post);
router.get('/book/:id/delete',book_controller.book_delete_get);
router.post('/book/:id/delete',book_controller.book_delete_post);
router.get('/book/:id/update',book_controller.book_update_get);
router.post('/book/:id/update',book_controller.book_update_post);
router.get('/book/:id',book_controller.book_detail);
router.get('/books',book_controller.book_list);

// Author Routers

// Note: This must come before /author/:id route 
router.get('/author/create',author_controller.author_create_get);
router.post('/author/create',author_controller.author_create_post);
router.get('/author/:id/delete',author_controller.author_delete_get);
router.post('/author/:id/delete',author_controller.author_delete_post);
router.get('/author/:id/update',author_controller.author_update_get);
router.post('/author/:id/update',author_controller.author_update_post);
router.get('/author/:id',author_controller.author_detail);
router.get('/authors',author_controller.author_list);

// genre Routers

// Note: This must come before /genre/:id route 
router.get('/genre/create',genre_controller.genre_create_get);
router.post('/genre/create',genre_controller.genre_create_post);
router.get('/genre/:id/delete',genre_controller.genre_delete_get);
router.post('/genre/:id/delete',genre_controller.genre_delete_post);
router.get('/genre/:id/update',genre_controller.genre_update_get);
router.post('/genre/:id/update',genre_controller.genre_update_post);
router.get('/genre/:id',genre_controller.genre_detail);
router.get('/genres',genre_controller.genre_list);

// bookinstance Routers

// Note: This must come before /bookinstance/:id route 
router.get('/bookinstance/create',
  bookinstance_controller.bookinstance_create_get);
router.post('/bookinstance/create',
  bookinstance_controller.bookinstance_create_post);
router.get('/bookinstance/:id/delete',
  bookinstance_controller.bookinstance_delete_get);
router.post('/bookinstance/:id/delete',
  bookinstance_controller.bookinstance_delete_post);
router.get('/bookinstance/:id/update',
  bookinstance_controller.bookinstance_update_get);
router.post('/bookinstance/:id/update',
  bookinstance_controller.bookinstance_update_post);
router.get('/bookinstance/:id',bookinstance_controller.bookinstance_detail);
router.get('/bookinstances',bookinstance_controller.bookinstance_list);

module.exports = router;
