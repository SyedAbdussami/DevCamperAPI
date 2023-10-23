const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');

//@desc get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach((param) => delete reqQuery[param]);

  const queryStr = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  let query = Bootcamp.find(JSON.parse(queryStr)).populate('Courses');

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    // console.log(fields);
    query = query.select(fields);
  }
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    // console.log(fields);
    query = query.sort(fields);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  query = query.skip(startIndex).limit(limit);
  const bootcamps = await query;
  const totalDocs = await Bootcamp.countDocuments();

  const pagination = {};
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  if (endIndex < totalDocs) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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
  console.log(req.body);
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
