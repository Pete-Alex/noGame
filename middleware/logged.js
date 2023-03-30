function isUserLoggedIn(req, res, next) {
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

function isUserPlanetOwner(req, res, next) {
    if (req.session.currentUser.planetListOwned.some(e => e._id === req.params.planetId)) {
        next();
    } else {
        res.redirect(`/`);
    }
}

module.exports = { 
    isUserLoggedIn,
    isUserLoggedOut,
    isUserPlanetOwner
  };