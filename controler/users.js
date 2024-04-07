const User = require("../models/user.js");



  module.exports.signupForm = (req, res) => {
    res.render("./listings/users/signUp.ejs");
  };

  module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        username: username,
        email: email,
      });
      let registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to Wanderlust");
        res.redirect("/listings");
      });
    } catch (er) {
      req.flash("err", er.message);
      res.redirect("/listings");
    }
  };

  module.exports.loginForm = (req, res) => {
    res.render("./listings/users/login.ejs");
  };

  module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out successfully");
      res.redirect("/listings");
    });
  };