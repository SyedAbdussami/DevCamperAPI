const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');
const path = require('path');
const advancedResults = require('../middlewares/advancedResults');

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc get a bootcamp with an id
//@route GET /api/v1/bootcamps/:id
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

//@desc create a bootcamp
//@route POST /api/v1/bootcamps
//@access Public
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  req.body.user = req.user.id;

  //check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //If user is not admin then he can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    next(
      new errorResponse(
        `The user with id${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc update a bootcamp with an id
//@route PUT /api/v1/bootcamps/:id
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

//@desc delete a bootcamp with an id
//@route DELETE /api/v1/bootcamps/:id
//@access Public
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  // const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse('Bootcamp does not exist for the given id', 404)
    );
  }
  bootcamp.deleteOne();
  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc get all bootcamps within a radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc upload bootcamp photo
//@route PUT /api/v1/bootcamps/:Id/photo
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new errorResponse('Bootcamp does not exist for the given id', 404)
    );
  }

  if (!req.files) {
    return next(new errorResponse('Please upload a photo', 400));
  }

  const file = req.files.undefined;

  if (file.mimetype != 'image/jpeg') {
    return next(new errorResponse('Please upload a image file', 400));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new errorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD_SIZE}`,
        400
      )
    );
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // console.log(req.files.undefined);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
