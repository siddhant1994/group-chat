const Joi = require("joi");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const validateCreateUserRequest = async (req) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      passwordConfirm: Joi.string().required(),
      role: Joi.any().valid("user").default("user"),
    });
    return await schema.validateAsync(
      { ...req },
      { allowUnknown: true, stripUnknown: true }
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    let reqbody;
    try {
      reqbody = await validateCreateUserRequest(req.body);
    } catch (validationError) {
      return next(new ApiError(validationError.message, 401));
    }
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    newUser.save();
    return res.status(200).json({
      status: "success",
      user: newUser,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const userList = await User.find({ role: "user" });
    return res.status(200).json({
      status: "success",
      result: userList.length,
      users: userList,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
