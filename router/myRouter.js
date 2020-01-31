const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, validatePassword } = require("../models/User");
const { jwtSecret } = require("../common/jwt_config");

const router = express.Router();

router.get("/page", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.json({ result: true, user });
  } catch (error) {
    res.status(500).json({ result: false, error: error.details[0].message });
  }
});

router.patch("/edit", async (req, res) => {
  try {
    const {
      user: { id },
      body: { name, email }
    } = req;
    await User.updateOne({ _id: id }, { $set: { name, email } });

    const token = jwt.sign(
      {
        id,
        name,
        email
      },
      jwtSecret,
      {
        expiresIn: "1h"
      }
    );

    res.json({ result: { message: "User Updated", token } });
  } catch (error) {
    res.status(500).json({ result: false, error: error.details[0].message });
  }
});

router.patch("/changePassword", async (req, res, next) => {
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
      await User.updateOne(
        { _id: req.user.id },
        { $set: { password: hashedNewPassword } }
      );
      res.json({
        result: true,
        msg: "비밀번호가 업데이트되었습니다."
      });
    } else {
      res.json({ result: false, msg: "현재 비밀번호가 틀렸습니다." });
    }
  } catch (error) {
    res.status(500).json({ result: false, error });
  }
});

module.exports = router;
