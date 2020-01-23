const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: "Text is required"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  }
});

const Comment = model("Comment", CommentSchema);

module.exports = { Comment };
