const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/sendMail');
const crypto = require('crypto');

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

//@desc Forgot Password
//@route POST /api/v1/user/forgotPassword
//@access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorResponse('User not found for this email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  // console.log(resetToken);
  // console.log(req.get('host'));

  await user.save({ validateBeforeSave: false });

  let resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;
  // console.log(resetUrl);

  const message = `please make a PUT resquest to ${resetUrl}`;
  console.log(message);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({
      success: true,
      data: 'email sent',
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new errorResponse('Unable to send the email', 500));
  }
});

//@desc login a user
//@route POST /api/v1/user/login
//@access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // console.log(req.params);
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new errorResponse('invalid token', 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  tokenResponse(user, 200, res);
});
