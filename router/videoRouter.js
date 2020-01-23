const express = require("express");
const uploadMulter = require("../common/multer");
const auth = require("../common/auth")();

const { Video } = require("../models/Video");

const router = express.Router();

router.get("/all", async (req, res, next) => {
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

router.get("/:id", async (req, res, next) => {
  try {
    const {
      params: { id }
    } = req;
    const video = await Video.findById(id);
    res.json({ result: { video } });
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
      body: { title, description },
      file: { location }
    } = req;

    try {
      const newVideo = await Video({
        fileUrl: location,
        title,
        description,
        creator: req.user.id
      });
      newVideo.save();
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
