const express = require('express');
const router = express.Router();
const Controller = require('../controllers/book.controller');
const bookController = new Controller();
const authenticateJwt = require('../middleware/auth.middleware');
const isAdmin = require('../isAdmin/isAdmin')
const { body } = require('express-validator');
const upload = require('../controllers/multer.controller');




const bookValidationRules = () => [
  body('title').notEmpty().withMessage('Book title is required'),
  body('author').notEmpty().withMessage('Book Author is required'),
  body('genre').notEmpty().withMessage('Book Genre is required'),
  body('year').notEmpty().withMessage('Year of publish is required')
    .isLength({ min: 4, max: 4 }).withMessage('Year must be four digits'),

];

router.get('/search', authenticateJwt, bookController.searchBook);
router.get('/filter', authenticateJwt, bookController.filterByGenre);
router.get('/uploadBook', authenticateJwt, isAdmin, bookController.uploadBook);
router.get('/books', authenticateJwt, bookController.displayBook);
router.get('/books/:id', authenticateJwt, isAdmin, bookValidationRules(), bookController.getBook);
router.post('/books/:id', authenticateJwt, isAdmin, bookValidationRules(), bookController.updateBook);
router.post('/uploadBook', upload.single('bookcover'), authenticateJwt, isAdmin, bookValidationRules(),  bookController.addBook);
router.get('/books/:id/delete', authenticateJwt, isAdmin, bookController.getBookDelete);
router.post('/books/:id/delete', authenticateJwt, isAdmin, bookController.deleteBook);



module.exports = router;