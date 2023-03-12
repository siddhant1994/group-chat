const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const Joi = require("joi");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // payload + secret + expire time
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// cookie a small piece of text that a server sends to
const creatsendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // converting to milisec
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  
  // res.cookie("jwt", token, cookieOptions);
  
  // Remove the password from output
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const validateSignUpRequest = async (req) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      passwordConfirm: Joi.string().required(),
      role: Joi.any().valid("user", "admin").default("user"),
    });
    return await schema.validateAsync(
      { ...req },
      { allowUnknown: true, stripUnknown: true }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const validateLoginRequest = async (req) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    return await schema.validateAsync(
      { ...req },
      { allowUnknown: true, stripUnknown: true }
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    let reqbody;
    try {
      reqbody = await validateSignUpRequest(req.body);
    } catch (validationError) {
      return next(new ApiError(validationError.message, 401));
    }
    const { name, email, password, passwordConfirm, role } = reqbody;

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });

    user.save();

    return res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

exports.login = async (req, res, next) => {
  try {
    try {
      await validateLoginRequest(req.body);
    } catch (validationError) {
      return next(new ApiError(validationError.message, 401));
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (
      !user || // check user exist and password correct
      !(await user.correctPassword(password, user.password))
    ) {
      // candinate password,correctpassword
      return next(new ApiError("incorrect email or password", 401));
    }
    // if eveything is ok
    return creatsendToken(user, 200, res);
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
