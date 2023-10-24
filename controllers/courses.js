const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

//@desc get courses
//@route GET /api/v1/courses/
//@route GET /api/v1/bootcamps/:bootcampid/courses
//@access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;
  if (!courses) {
    return next(
      new errorResponse('Course does not exist for the given id', 404)
    );
  }
  res.status(200).json({
    success: true,
    cout: courses.length,
    data: courses,
  });
});

//@desc get a course
//@route GET /api/v1/courses/:id
//@access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  console.log(req.params);

  if (!course) {
    return next(
      new errorResponse(
        `Course does not exist for the given id ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc create a course
//@route POST /api/v1/bootcamps/:bootcampId/courses/
//@access Public
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  console.log(req.params);

  if (!bootcamp) {
    return next(
      new errorResponse(
        `Bootcamp does not exist for the given id ${req.params.bootcampId}`,
        404
      )
    );
  }
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc update a course
//@route POST /api/v1/courses/:id
//@access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new errorResponse(
        `Course does not exist for the given id ${req.params.id}`,
        404
      )
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc delete a course
//@route POST /api/v1/courses/:id
//@access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new errorResponse(
        `Course does not exist for the given id ${req.params.id}`,
        404
      )
    );
  }
  course.deleteOne();
  res.status(200).json({
    success: true,
    data: {},
  });
});
