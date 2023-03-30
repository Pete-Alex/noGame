const express = require("express");

//models
const BuildingType = require("../models/BuildingType.model");
const Planet = require("../models/Planet.model");
const User = require("../models/User.model");

//utils functions
const capitalize = require("../utils/capitalize");

const {
  gapTimeCalculation,
  checkPlanetUser,
  calcBuildingStats,
  displayPlanetDetail,
} = require("../utils/renderPlanet.js");

const {
  isUserLoggedIn,
  isUserLoggedOut,
  isUserPlanetOwner,
} = require("../middleware/logged.js");


const router = express.Router();


router.get("/planets", (req, res, next) =>{
  Planet.find()
    .populate("owner").sort([["name", "asc"]])
    .then((response)=>{
      const data = {
        planetsArray : response,
        user: req.session.currentUser
      }
      res.render("planets-list", data);
    })
});


// GET planet by id
router.get("/planets/:planetId", (req, res, next) => {

  //booleans to display so dynamic element on the page
  let data = {
    ischangeName: false,
    noLevelup: false,
  };

  const planetId = req.params.planetId;
  Planet.findById(planetId)
    .populate("buildings.buildingTypeId")
    .populate("owner")
    .then((response) => {
      //test to make only display changeName form is user is owner of the planet
      if (req.query.action === "changeName") {
        data.ischangeName = checkPlanetUser(
          req.session.currentUser._id,
          response.owner._id.toString()
        );
      }
      //test to display error message for level Up impossible
      if (req.query.errorMessage === "noLevelUp") {
        data.noLevelup = true;
      }
      const { isCurrentUserOwnPlanet, infoBuildings } = displayPlanetDetail(
        req.session.currentUser,
        response
      );

      data.user = req.session.currentUser;
      data.planetInfo = response;
      data.isCurrentUserOwnPlanet = isCurrentUserOwnPlanet;
      data.infoBuildings = infoBuildings;

      // all buildings type query for create new building form
      return BuildingType.find();
    })
    .then((response) => {
      data.buildingTypesInfo = response;
      res.render("planet-detail", data);
    })
    .catch((e) => {
      console.log("error getting the planet", e);
      next(e);
    });
});


// POST change name of planet by id
router.post("/planets/:planetId/change-name", isUserPlanetOwner, (req, res, next) => {
  const newPlanetName = capitalize(req.body.name);
  const planetId = req.params.planetId;
  Planet.findByIdAndUpdate(planetId, { name: newPlanetName }, { new: true })
    .then((response) => {
      res.redirect(`/planets/${response.id}`);
    })
    .catch((e) => {
      console.log("error changing planet Name", e);
      next(e);
    });
});


router.post("/planets/:planetId/new-building", isUserPlanetOwner, (req, res, next) => {
  const newBuilding = req.body.building;
  const planetId = req.params.planetId;
  Planet.findByIdAndUpdate(
    planetId,
    { $push: { buildings: { buildingTypeId: newBuilding, level: 1 } } },
    { new: true }
  )
    .then((response) => {
      res.redirect(`/planets/${response.id}`);
    })
    .catch((e) => {
      console.log("error adding new building", e);
      next(e);
    });
});

module.exports = router;