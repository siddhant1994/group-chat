const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    unique: true,
    trim: true,
    maxlength: [20, "must be less than or equal to 20"],
    minlength: [3, "must be greater than 3"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 4,
    select: false,
  },
});

// Encrpt the password ad Presave it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12); // hashing password
  this.passwordConfirm = undefined;
  next();
});

// comparing password
userSchema.methods.correctPassword = async (
  candidate_Password,
  user_Password
) => {
  return await bcrypt.compare(candidate_Password, user_Password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
