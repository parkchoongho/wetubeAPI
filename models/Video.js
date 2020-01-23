const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const VideoSchema = new Schema({
  fileUrl: {
    type: String,
    required: "FileUrl is required"
  },
  title: {
    type: String,
    required: "Title is required"
  },
  description: String,
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Video = model("Video", VideoSchema);

module.exports = { Video };
