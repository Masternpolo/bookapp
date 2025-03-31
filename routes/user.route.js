const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Controller = require('../controllers/user.controller');
const Books = require('../controllers/book.controller');
const bookController = new Books();
const userController = new Controller();
const authenticateJwt = require('../middleware/auth.middleware');
const isAdmin = require('../isAdmin/isAdmin');
const Usercontroller = require('../controllers/user.controller');

// Validation for registration and login
const userValidationRules = () => [
  body('username').notEmpty().withMessage('Username is required')
  .isLength({min: 5}).withMessage('Username must be 5 characters and above'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const loginValidationRules = () => [
  body('username').notEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

router.get('/register', (req, res) => {
  res.render('register', { errors: [], message: null });
});

router.get('/login', (req, res) => {
  res.render('login', {errors: [], message: null});
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/profile', authenticateJwt, (req, res) => {
  const user = req.user;
  res.render('profile', { user });
});


router.get('/chat', authenticateJwt, (req, res) => {
  const user = req.user;
  res.render('chat', { user });
});

router.get('/dashboard', authenticateJwt, (req, res) => {
  const user = req.user;
  res.render('dashboard', { user });
});

router.get('/adminDashboard', authenticateJwt, isAdmin, (req, res) => {
  const user = req.user;
  res.render('adminDashboard', { user });
});

router.get('/createUser', authenticateJwt, isAdmin, (req, res) => {
  res.render('createUser', { errors: [], message: null });
});

router.get('/getAllUsers', authenticateJwt, isAdmin, userController.getAllusers);

router.get('/error', authenticateJwt, (req, res) => {
  res.render('error', {message: null, status: null});
});



router.get("/favicon.ico", (req, res) => res.status(204).end());


router.post('/register', userValidationRules(), userController.register);
router.post('/createUser',authenticateJwt, isAdmin, userValidationRules(), userController.register);
router.post('/login', loginValidationRules(), userController.authenticate);
router.post('/logout', userController.logOut);




module.exports = router;

