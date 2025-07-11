const fs = require("fs");
const path = require("path");
const user = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Load public key for verifying JWT
const pathtokey = path.join(__dirname, "..", "rsa_public.pem");
const pub_key = fs.readFileSync(pathtokey, "utf8");

// Options for JWT strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: pub_key,
  algorithms: ["RS256"],
};

// JWT strategy
const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    let existingUser = await user.findById(payload.sub);

    if (existingUser) {
      return done(null, existingUser);
    } else {
      return done(null, false);
    }
  } catch (err) {
    console.error("Error in JWT strategy:", err);
    return done(err, false);
  }
});

// Export function to initialize JWT strategy
module.exports = (passport) => {
  passport.use(strategy);
};
