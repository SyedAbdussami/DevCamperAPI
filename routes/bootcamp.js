const express = require('express');
const router = express.Router();

//controllers

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const courseRouter = require('../routes/course');
const reviewRouter = require('../routes/reviews');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middlewares/advancedResults');

const { protect, authorize } = require('../middlewares/auth');

router.use('/:bootcampId/courses', courseRouter);

router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'Courses'), getBootCamps)
  .post(protect, authorize('publisher', 'admin'), createBootCamp);

router
  .route('/:id')
  .get(getBootCamp)
  .put(protect, authorize('publisher', 'admin'), updateBootCamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootCamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

// router.route('/:id/courses').get(getCourses);

module.exports = router;
