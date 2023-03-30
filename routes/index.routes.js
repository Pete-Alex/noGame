const express = require("express");

//models
const BuildingType = require("../models/BuildingType.model");
const Planet = require("../models/Planet.model");
const User = require("../models/User.model");

//utils functions
const capitalize = require("../utils/capitalize");

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

  //test to display error message
  if (req.query.errorMessage != undefined) {
    data.isErrormessage = true;
    switch (req.query.errorMessage) {
      case 'noNewPlanet':
        data.messageError = "you can't buy the planet, you don't have enough ressources"
        break;
    }
  }

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

  const newPlanetDetail = {
    name: capitalize(req.body.planetName),
    owner: req.session.currentUser._id,
    buildings: [],
    image: `planet-${Math.floor(Math.random() * (11 - 1 + 1) + 1)}.png`,
  };

  (async () => {
    try {
      if (req.session.currentUser.ressources.metal >= 100000 && req.session.currentUser.ressources.energy >= 100000) {

        //decrease ressources on session user
        req.session.currentUser.ressources.metal -= 100000;
        req.session.currentUser.ressources.energy -= 100000;

        const newPlanetObj = await Planet.create(newPlanetDetail);

        const userUpadted = await User.findByIdAndUpdate(req.session.currentUser._id, { $push: { planetListOwned: newPlanetObj._id }, $set: { "ressources.metal": req.session.currentUser.ressources.metal, "ressources.energy": req.session.currentUser.ressources.energy, } }, { new: true }).populate("planetListOwned");
        req.session.currentUser = userUpadted.toObject();

        res.redirect(`/`);
      } else {
        res.redirect(`/?errorMessage=noNewPlanet`);
      }



    } catch (e) {
      console.log("error", e);
    }
  })();


});

module.exports = router;