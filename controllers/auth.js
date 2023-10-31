const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

//@desc register a user
//@route POST /api/v1/user/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  console.log(req.body);

  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  const token = user.getJsonWebToken();
  res.status(200).json({
    success: true,
    token,
  });
});

//@desc login a user
//@route POST /api/v1/user/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new errorResponse('User does not exist. Please register first', 401)
    );
  }
  const isMatch = user.isMatch(password);

  if (!isMatch) {
    return next(new errorResponse('Passord or email is wrong', 401));
  }
  const token = user.getJsonWebToken();
  res.status(200).json({
    success: true,
    token,
  });
});
