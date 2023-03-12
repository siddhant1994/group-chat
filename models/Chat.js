const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const ChatSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    likes: {
      type: likesSchema,
      default: { count: 0, users: [] },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
