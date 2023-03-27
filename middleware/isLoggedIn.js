function isUserLoggedIn(req, res, next) {
  console.log("test");
  if (req.session.currentUser) {
      next();
  } else {
      res.redirect("/login");
  }
}

module.exports = isUserLoggedIn;