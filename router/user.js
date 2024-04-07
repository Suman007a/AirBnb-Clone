const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require('../middlewares.js');
const userControler = require("../controler/users.js");


router.route("/signup")
.get(userControler.signupForm)
.post(wrapAsync(userControler.signup));

router.route("/login")
.get(userControler.loginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControler.login
);

router.get(
  "/logout",
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash("err", "You must be logged in before log out");
      return res.redirect("/login");
    }
    next();
  },
  userControler.logout
);
module.exports = router;
