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
  if (req.session.currentUser != undefined) {
    User.findById(req.session.currentUser._id)
      .populate("planetListOwned")
      .then((response) => {
        res.render("index", {
          user: req.session.currentUser,
          userData: response,
        });
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
  Planet.create(newPlanetDetail)
    .then((response) => {
      return User.findByIdAndUpdate(
        req.session.currentUser._id,
        { $push: { planetListOwned: response._id } },
        { new: true }
      ).populate("planetListOwned");
    })
    .then((response) => {
      req.session.currentUser = response.toObject();
      res.redirect(`/`);
    })
    .catch((e) => {
      console.log("error creating new planet", e);
      next(e);
    });
});

module.exports = router;