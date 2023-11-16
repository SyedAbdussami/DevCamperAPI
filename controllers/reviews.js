const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const Review = require('../models/Review');

//@desc get all bootcamp reviews
//@route GET /api/v1/bootcamps/:bootcampId/reviews
//@access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc get all bootcamp reviews
//@route GET /api/v1/reviews/:id
//@access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!review) {
    return next(
      new errorResponse(`Review with id ${req.params.id} does not exist`, 400)
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc create a review
//@route POST /api/v1/reviews
//@access Public
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.id;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp woth id ${req.params.id} does not exist`, 404)
    );
  }
  const review = await Review.create(req.body);

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc create a review
//@route PUT /api/v1/bootcamps/:bootcampId/reviews/:id
//@access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new errorResponse(`review with id ${req.params.id} does not exist`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new errorResponse(`Not Authorized to update this review`, 400));
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc delete a review
//@route DELETE /api/v1/bootcamps/:bootcampId/reviews/:id
//@access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new errorResponse(`review with id ${req.params.id} does not exist`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new errorResponse(`Not Authorized to delete this review`, 400));
  }
  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
