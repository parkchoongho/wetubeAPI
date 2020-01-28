const express = require("express");
const bcrypt = require("bcrypt");

const { User, validatePassword } = require("../models/User");

const router = express.Router();

router.get("/page", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.json({ result: true, user });
  } catch (error) {
    res.status(500).json({ result: false, error: error.details[0].message });
  }
});

router.patch("/changePassword", async (req, res, next) => {
  console.log(req.user);
  const {
    body: { curPassword, password }
  } = req;
  const passwordObj = { password };

  const { error } = validatePassword(passwordObj);

  if (error) {
    // 검증을 통과 못할 시
    res
      .status(400)
      .send()
      .json({ result: false, error });
    next();
    return;
  }
  try {
    const user = await User.findById(req.user.id);
    const result = await bcrypt.compare(curPassword, user.password);

    if (result) {
      const saltRound = 10;
      const hashedNewPassword = await bcrypt.hash(password, saltRound);
      const updatedUser = await User.updateOne(
        { _id: req.user.id },
        { $set: { password: hashedNewPassword } }
      );
      res.json({
        result: true,
        updatedUser,
        msg: "비밀번호가 업데이트되었습니다."
      });
    } else {
      res.json({ result: false, msg: "현재 비밀번호가 틀렸습니다." });
    }
  } catch (error) {
    res.status(500).json({ result: false, error });
  } finally {
    next();
  }
});

module.exports = router;
