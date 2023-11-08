const express = require('express');
const router = express.Router();

//controllers

const {
  register,
  login,
  getMe,
  forgotPassword,
} = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getMe);

router.post('/forgotPassword', forgotPassword);

module.exports = router;
