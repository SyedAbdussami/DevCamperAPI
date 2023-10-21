const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    data: bootcamps,
    count: bootcamps.length,
  });
});

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse('Bootcamp does not exist for the given id', 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new errorResponse('Bootcamp does not exist for the given id', 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse('Bootcamp does not exist for the given id', 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
