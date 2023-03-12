const Joi = require("joi");
const Group = require("../models/Group");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const validateCreateGroupRequest = async (req) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      users: Joi.array().required(),
    });
    return await schema.validateAsync(
      { ...req },
      { allowUnknown: true, stripUnknown: true }
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.createGroup = async (req, res, next) => {
  try {
    let reqbody;
    try {
      reqbody = await validateCreateGroupRequest(req.body);
    } catch (validationError) {
      return next(new ApiError(validationError.message, 401));
    }
    const newGroup = await Group.create({
      name: reqbody.name,
      users: reqbody.users,
      createdBy: req.user._id,
    });
    newGroup.save();
    return res.status(200).json({
      status: "success",
      group: newGroup,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

exports.getGroupDetails = async (req, res, next) => {
  try {
    const [groupDetails] = await Group.aggregate([
      {
        $match: {
          name: req.params.name,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "userObj",
        },
      },
      {
        $unwind: {
          path: "$userObj",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
        },
      },
      {
        $project: {
          "userObj.password": 0,
          "createdBy.password": 0,
          "userObj._id": 0,
          "createdBy._id": 0,
        },
      },
      {
        $group: {
          _id: "$name",
          users: {
            $addToSet: "$userObj",
          },
          createdBy: {
            $first: "$createdBy",
          },
        },
      },
    ]);
    return res.status(200).json({
      status: "success",
      group: groupDetails,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

exports.getGroupList = async (req, res, next) => {
  try {
    const list = await Group.find({}, { createdBy: 0, users: 0 });
    return res.status(200).json({
      status: "success",
      result: list.length,
      groups: list,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
