const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add group name!"],
      unique: true,
      trim: true,
      maxlength: [20, "must be less than or equal to 20"],
      minlength: [3, "must be greater than 3"],
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
