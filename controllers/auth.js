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
  tokenResponse(user, 200, res);
});

//@desc login a user
//@route POST /api/v1/user/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(
      new errorResponse('User does not exist. Please register first', 401)
    );
  }
  const isMatch = await user.isMatch(password);

  if (!isMatch) {
    return next(new errorResponse('Passord or email is wrong', 401));
  }
  tokenResponse(user, 200, res);
});

const tokenResponse = (user, statusCode, res) => {
  const token = user.getJsonWebToken();
  const options = {
    httpOnly: true,
    exprires: new Date(
      Date.now() * process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000
    ),
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

//@desc login a user
//@route POST /api/v1/user/login
//@access Public
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(req.user);

  res.status(200).json({
    success: true,
    user,
  });
});
