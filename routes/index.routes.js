const express = require("express");

//models
const BuildingType = require("../models/BuildingType.model");
const Planet = require("../models/Planet.model");
const User = require("../models/User.model");

//utils functions
const capitalize = require("../utils/capitalize");
const checkErrorMessage = require("../utils/errorMessage");

const {
  isUserLoggedIn,
  isUserLoggedOut,
  isUserPlanetOwner,
} = require("../middleware/logged.js");


const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {

  //booleans to display so dynamic element on the page
  let data = {
    isErrormessage: false,
  };

  //check list of error message to display the right one
  data = checkErrorMessage(req.query, data);

  if (req.session.currentUser != undefined) {
    User.findById(req.session.currentUser._id)
      .populate("planetListOwned")
      .then((response) => {
        data.user = req.session.currentUser;
        data.userData = response;
        res.render("index", data);
      })
      .catch((e) => {
        console.log("error getting user", e);
        next(e);
      });
  } else {
    res.render("index", { user: req.session.currentUser });
  }
});


router.post("/create-planet", isUserLoggedIn, (req, res, next) => {

  //new planet Data
  const newPlanetDetail = {
    name: capitalize(req.body.planetName),
    owner: req.session.currentUser._id,
    buildings: [],
    image: `planet-${Math.floor(Math.random() * (11 - 1 + 1) + 1)}.png`,
  };

  (async () => {
    try {
      //test to make sure user has enough ressources
      if (req.session.currentUser.ressources.metal >= 100000 && req.session.currentUser.ressources.energy >= 100000) {

        //decrease ressources on session user
        req.session.currentUser.ressources.metal -= 100000;
        req.session.currentUser.ressources.energy -= 100000;

        //creation of new planet document
        const newPlanetObj = await Planet.create(newPlanetDetail);

        //update of user to link the new planet and udpate ressources
        const userUpadted = await User.findByIdAndUpdate(req.session.currentUser._id, { $push: { planetListOwned: newPlanetObj._id }, $set: { "ressources.metal": req.session.currentUser.ressources.metal, "ressources.energy": req.session.currentUser.ressources.energy, } }, { new: true }).populate("planetListOwned");
        req.session.currentUser = userUpadted.toObject();

        res.redirect(`/`);
      } else {
        //if user has not enough ressource send error message
        res.redirect(`/?errorMessage=noNewPlanet`);
      }
    } catch (e) {
      console.log("error", e);
    }
  })();


});

module.exports = router;