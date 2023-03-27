function isUserLoggedIn(req, res, next) {
    console.log("test");
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login");
    }
}

function isUserLoggedOut(req, res, next) {
    // if an already logged in user tries to access the login page it
    // redirects the user to the home page
    if (req.session.currentUser) {
        return res.redirect("/");
    }
    next();
}

module.exports = { 
    isUserLoggedIn,
    isUserLoggedOut
  };