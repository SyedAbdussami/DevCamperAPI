const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootCamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      data: bootcamps,
      count: bootcamps.length,
    });
  } catch (err) {
    // next(new errorResponse('Bootcamps do not exist', 404));
    next(err);
  }
};

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootCamp = async (req, res, next) => {
  try {
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
  } catch (err) {
    // next(new errorResponse('Bootcamp does not exist for the given id', 404));
    next(err);
  }
};

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.createBootCamp = async (req, res, next) => {
  try {
    console.log(req.body);
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    // next(new errorResponse('Error creating a bootcamp', 400));
    next(err);
  }
};

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.updateBootCamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    console.log(error);
    // next(new errorResponse('Error updating the bootcamp', 400));
    next(error);
  }
};

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.deleteBootCamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    // next(new errorResponse('Error deleting the bootcamp', 400));
    next(error);
  }
};
