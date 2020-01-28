const express = require("express");

const { User } = require("../models/User");

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const {
      params: { id }
    } = req;
    const user = await User.findById(id).populate("videos");
    res.json({ result: true, user });
  } catch (error) {
    res.status(500).json({ result: false, error: error.details[0].message });
  }
});

module.exports = router;
