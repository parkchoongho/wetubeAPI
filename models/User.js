const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  },

  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },

  avatarUrl: String,

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],

  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video"
    }
  ]
});

const User = model("User", UserSchema);

const validateUser = user => {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(5)
      .max(30)
      .required(),
    password: Joi.string()
      .alphanum()
      .lowercase()
      .min(5)
      .max(20),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
  });
  return schema.validate(user);
};

const validateLogin = req => {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .alphanum()
      .lowercase()
      .min(5)
      .max(20)
  });
  return schema.validate(req);
};

const validatePassword = password => {
  const schema = Joi.object({
    password: Joi.string()
      .alphanum()
      .lowercase()
      .min(5)
      .max(20)
  });
  return schema.validate(password);
};

module.exports = {
  User,
  validateUser,
  validateLogin,
  validatePassword
};
