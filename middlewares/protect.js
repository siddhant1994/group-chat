const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
//  Protecting Routes
module.exports = async (req, res, next) => {
  // 1- get the token check if exist
  //   const token=req.header('Authorization').replace('Bearer ','')
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you are not login ", 401));
  }
  // 2- validate the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3- check user exits
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new ApiError("the user belong to this token does not exists ", 401)
    );
  }

  req.user = currentUser;
  next();
};
