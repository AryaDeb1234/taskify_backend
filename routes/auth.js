var express = require('express');
var router = express.Router();

var passport = require("passport");
var { genpassword } = require("../lib/passwordutilis");
var user = require("../models/user");


// POST /login
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, userObj, info) {
    if (err) return next(err);

    if (!userObj) {
      // Authentication failed
      return res.status(401).json({ success: false, message: info.message || "Invalid credentials" });
    }

    req.login(userObj, function (err) {
      if (err) return next(err);
      return res.json({ success: true, message: "Login successful", user: { id: userObj._id, username: userObj.username } });
    });
  })(req, res, next);
});


// POST /register
router.post('/register', async function (req, res, next) {
  let { username, password } = req.body;

  try {
    let existuser = await user.findOne({ username });

    if (existuser) {
      return res.status(400).json({ success: false, message: "User already exists. Please login." });
    }

    let { salt, hash } = genpassword(password);

    let newuser = new user({
      username,
      hash,
      salt
    });

    await newuser.save();
    res.status(201).json({ success: true, message: "Registration successful! You can now login." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});


// GET /api/current-user
router.get('/api/current-user', function (req, res) {
  if (req.isAuthenticated()) {
    return res.json({ loggedIn: true, user: { id: req.user._id, username: req.user.username } });
  } else {
    return res.status(401).json({ loggedIn: false, message: "Not authenticated" });
  }
});


// GET /logout
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.json({ success: true, message: "You have logged out successfully." });
  });
});


// Test route
router.get('/', function (req, res, next) {
  res.json({ message: "API is working" });
});


module.exports = router;
