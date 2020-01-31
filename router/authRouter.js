const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validateUser, validateLogin } = require("../models/User");
const { jwtSecret } = require("../common/jwt_config");

const router = express.Router();

router.post("/join", async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  try {
    const { name, email, password } = req.body;

    let settler = await User.findOne({ email });
    if (settler) {
      res.status(400).send("User Already Registered");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      password: hashedPW,
      email
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email
      },
      jwtSecret,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      result: token
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      error
    });
  } finally {
    next();
  }
});

router.post("/login", async (req, res, next) => {
  const { error } = validateLogin(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("User Is Not Registered");

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email
        },
        jwtSecret,
        {
          expiresIn: "1h"
        }
      );
      res.json({
        result: true,
        token
      });
    } else {
      return res.status(400).send("Invalid email or password");
    }
  } catch (error) {
    res.status(500).json({
      result: false,
      error
    });
  } finally {
    next();
  }
});

module.exports = router;
