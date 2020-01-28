const express = require("express");
const uploadMulter = require("../common/multer");
const auth = require("../common/auth")();

const { Video } = require("../models/Video");
const { User } = require("../models/User");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json({ result: { videos } });
  } catch (error) {
    res.status(500).json({
      result: false,
      error
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const {
      params: { id }
    } = req;
    const video = await Video.findById(id).populate("creator");
    res.json({ result: { video } });
  } catch (error) {
    res.status(500).json({
      result: false,
      error
    });
  }
});

router.patch("/:id/edit", auth.authenticate(), async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;

  try {
    const video = await Video.findById(id);

    if (String(video.creator) !== String(req.user.id)) {
      throw Error("Unauthorized");
    }
    await Video.updateOne({ _id: id }, { $set: { title, description } });
    res.json({ result: "Video Updated" });
  } catch (error) {
    res.status(500).json({
      result: false,
      error
    });
  }
});

router.post("/upload", auth.authenticate(), uploadMulter, async (req, res) => {
  const {
    body: { title, description, userId },
    file: { location },
    user: { id }
  } = req;

  try {
    const newVideo = await Video({
      fileUrl: location,
      title,
      description,
      creator: id
    });
    newVideo.save();

    const user = await User.findById(id);
    user.videos.push(newVideo);
    user.save();

    res.json({ result: "File Uploaded" });
  } catch (error) {
    res.status(500).json({
      result: false,
      error
    });
  }
});

router.delete("/:id/delete", auth.authenticate(), async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);

    if (String(video.creator) !== String(req.user.id)) {
      throw Error("Unauthorized");
    }
    await Video.findByIdAndRemove(id);
    res.json({ result: "Video Deleted" });
  } catch (error) {
    res.status(500).json({
      result: false,
      error
    });
  }
});

module.exports = router;
