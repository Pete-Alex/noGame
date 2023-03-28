const express = require("express");

const BuildingType = require("../models/BuildingType.model");
const Planet = require("../models/Planet.model");
const User = require("../models/User.model");

const { gapTimeCalculation, checkPlanetUser, displayPlanetDetail } = require('../utils/renderPlanet.js');
const { costMine, productionMine, costPowerPlant, productionPowerPlant } = require('../utils/buildingTypeEquation.js');

const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.session.currentUser != undefined) {
    User.findById(req.session.currentUser._id)
      .populate("planetListOwned")
      .then((response) => {
        //console.log(response);
        console.log(response.planetListOwned[0].image)
        res.render("index", { user: req.session.currentUser, userData: response });
      })
      .catch((e) => {
        console.log("error getting user", e);
        next(e);
      });
  } else{
    res.render("index", { user: req.session.currentUser });
  }
});

// GET planet by id
router.get('/planet/:planetId', (req, res, next) => {
  let ischangeName = false;
  const planetId = req.params.planetId;
  Planet.findById(planetId)
    .populate("buildings.buildingTypeId")
    .populate("owner")
    .then((response) => {

      if (req.query.action === "changeName") {
        ischangeName = checkPlanetUser(req.session.currentUser._id, response.owner._id.toString())
      }

      const data = displayPlanetDetail(req.session.currentUser, response);
      res.render("planet-detail", {
        user: req.session.currentUser,
        planetInfo: response,
        infoBuildings: data.infoBuildings,
        isCurrentUserOwnPlanet: data.isCurrentUserOwnPlanet,
        ischangeName
      });
    })
    .catch((e) => {
      console.log("error getting the planet", e);
      next(e);
    });
});

router.post("/planet/:planetId/change-name", (req, res, next) => {
  const newPlanetName = req.body.name;
  const planetId = req.params.planetId;
  Planet.findByIdAndUpdate(planetId, { name: newPlanetName }, { new: true })
    .then((response) => {
      res.redirect(`/planet/${response.id}`);
    })
    .catch(e => {
      console.log("error changing planet Name", e);
      next(e);
    });
});

router.get("/planet/:planetId/new-building", (req, res, next) => {
  const planetId = req.params.planetId;
  (async () => {
    try {
      const planetObj = await Planet.findById(planetId).populate("owner");
      const buildingTypesObj = await BuildingType.find();
      res.render("add-new-building", { planetInfo: planetObj, buildingTypesInfo: buildingTypesObj });
    } catch (e) {
      console.log("error", e)
    }
  })();
});

router.post("/planet/:planetId/new-building", (req, res, next) => {
  const newBuilding = req.body.building;
  const planetId = req.params.planetId;
  Planet.findByIdAndUpdate(planetId, { $push: { "buildings": { buildingTypeId: newBuilding, level: 1 } } }, { new: true })
    .then((response) => {
      res.redirect(`/planet/${response.id}`);
    })
    .catch(e => {
      console.log("error adding new building", e);
      next(e);
    });
});


module.exports = router;