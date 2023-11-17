const express = require('express');
const router = express.Router();

//controllers

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  updatePassword,
  logOut,
} = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getMe);

router.post('/forgotPassword', forgotPassword);

router.put('/resetpassword/:resetToken', resetPassword);

router.put('/updateDetails', protect, updateUserDetails);

router.put('/updatePasword', protect, updatePassword);

router.put('/logout', logOut);

module.exports = router;
