const Joi = require("joi");
const Chat = require("../models/Chat");
const ApiError = require("../utils/ApiError");

const validateSendMessageRequest = async (req) => {
  try {
    const schema = Joi.object({
      text: Joi.string().required(),
      group: Joi.string().required(),
    });
    return await schema.validateAsync(
      { ...req },
      { allowUnknown: true, stripUnknown: true }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const validateLikeMessageRequest = async (req) => {
  try {
    const schema = Joi.object({
      chatId: Joi.string().required(),
    });
    return await schema.validateAsync(
      { ...req },
      { allowUnknown: true, stripUnknown: true }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const validateGetGroupChatRequest = async (req) => {
  try {
    const schema = Joi.object({
      group: Joi.string().required(),
      pageNo: Joi.number().default(0),
      perPage: Joi.number().default(10),
    });
    return await schema.validateAsync(
      { ...req },
      { allowUnknown: true, stripUnknown: true }
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    let reqbody;
    try {
      reqbody = await validateSendMessageRequest(req.body);
    } catch (validationError) {
      return next(new ApiError(validationError.message, 401));
    }
    const newChat = await Chat.create({
      text: reqbody.text,
      group: reqbody.group,
      author: req.user._id,
    });
    newChat.save();
    return res.status(200).json({
      status: "success",
      chat: newChat,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

exports.likeMessage = async (req, res, next) => {
  try {
    let reqbody;
    try {
      reqbody = await validateLikeMessageRequest(req.body);
    } catch (validationError) {
      return next(new ApiError(validationError.message, 401));
    }
    const chatObj = await Chat.findOne({ _id: reqbody.chatId });

    if (!chatObj.likes.users.includes(req.user._id)) {
      chatObj.likes.count += 1;
      chatObj.likes.users.push(req.user._id);
    }

    await chatObj.save();
    return res.status(200).json({
      status: "success",
      chat: chatObj,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

exports.getGroupChat = async (req, res, next) => {
  try {
    let reqbody;
    try {
      reqbody = await validateGetGroupChatRequest(req.query);
    } catch (validationError) {
      return next(new ApiError(validationError.message, 401));
    }
    const { group, perPage, pageNo } = reqbody;
    const chats = await Chat.find(
      { group: group },
      { group: 0, "likes.users": 0 }
    )
      .skip(perPage * pageNo)
      .limit(perPage);

    return res.status(200).json({
      status: "success",
      perPage,
      pageNo,
      chats: chats,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
