const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  jwtSecret: process.env.TOKEN_KEY,
  jwtSession: {
    session: false
  }
};
