const passport = require("passport");
const passportJWT = require("passport-jwt");

const config = require("./jwt_config");
const { User } = require("../models/User");
const { ExtractJwt, Strategy } = passportJWT;

const options = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
};

module.exports = () => {
  const strategy = new Strategy(options, async (payload, done) => {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, {
        id: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      return done(new Error("User Not Found"), null);
    }
  });
  passport.use(strategy);
  return {
    initialize() {
      return passport.initialize();
    },
    authenticate() {
      return passport.authenticate("jwt", config.jwtSession);
    }
  };
};
