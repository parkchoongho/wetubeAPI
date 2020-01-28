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

router.patch("/:id/edit", async (req, res) => {
  try {
    const {
      params: { id },
      body: { title, description }
    } = req;
    console.log(title, description);
    await Video.updateOne({ _id: id }, { $set: { title, description } });
    res.json({ result: "Video Updated" });
  } catch (error) {
    res.status(500).json({
      result: false,
      error
    });
  }
});

router.post(
  "/upload",
  auth.authenticate(),
  uploadMulter,
  async (req, res, next) => {
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
  }
);

module.exports = router;
