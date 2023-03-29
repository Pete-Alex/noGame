const express = require("express");

const BuildingType = require("../models/BuildingType.model");
const Planet = require("../models/Planet.model");
const User = require("../models/User.model");

const { gapTimeCalculation, checkPlanetUser, calcBuildingStats, displayPlanetDetail } = require('../utils/renderPlanet.js');
const { costMine, productionMine, costPowerPlant, productionPowerPlant } = require('../utils/buildingTypeEquation.js');

const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  let isCreatePlanet = false;
  if (req.query.action === "createPlanet") {
    isCreatePlanet = true
  }
  if (req.session.currentUser != undefined) {
    User.findById(req.session.currentUser._id)
      .populate("planetListOwned")
      .then((response) => {
        console.log(response);
        res.render("index", { user: req.session.currentUser, userData: response, isCreatePlanet });
      })
      .catch((e) => {
        console.log("error getting user", e);
        next(e);
      });
  } else {
    res.render("index", { user: req.session.currentUser });
  }
});

router.post("/create-planet", (req, res, next) => {
  const newPlanetDetail = {
    name: req.body.planetName,
    owner: req.session.currentUser._id,
    buildings: [],
    image: `planet-${Math.floor(Math.random() * (11 - 1 + 1) + 1)}.png`
  }
  Planet.create(newPlanetDetail)
    .then((response) => {
      return User.findByIdAndUpdate(req.session.currentUser._id,{ $push: { planetListOwned: response._id } }, { new: true })
    })
    .then((response) =>{
      res.redirect(`/`);
    })
    .catch(e => {
      console.log("error creating new planet", e);
      next(e);
    });
});

// GET planet by id
router.get('/planet/:planetId', (req, res, next) => {
  let ischangeName = false;
  let noLevelup = false;
  const planetId = req.params.planetId;
  Planet.findById(planetId)
    .populate("buildings.buildingTypeId")
    .populate("owner")
    .then((response) => {
      if (req.query.action === "changeName") {
        ischangeName = checkPlanetUser(req.session.currentUser._id, response.owner._id.toString())
      }
      if (req.query.errorMessage === "noLevelUp") {
        noLevelup = true
      }
      const data = displayPlanetDetail(req.session.currentUser, response);
      res.render("planet-detail", {
        user: req.session.currentUser,
        planetInfo: response,
        infoBuildings: data.infoBuildings,
        isCurrentUserOwnPlanet: data.isCurrentUserOwnPlanet,
        ischangeName,
        noLevelup
      });
    })
    .catch((e) => {
      console.log("error getting the planet", e);
      next(e);
    });
});

// POST change name of planet by id
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

router.post("/buildings/:buildingId/harvest", (req, res, next) => {
  const buildingId = req.params.buildingId;
  (async () => {
    try {
      const planetObj = await Planet.findOne({ "buildings._id": buildingId }).populate("buildings.buildingTypeId");
      const buildingIndex = planetObj.buildings.findIndex((element) => element._id.toString() === buildingId);
      const statsBuilding = calcBuildingStats(planetObj.buildings[buildingIndex])
      req.session.currentUser.ressources.metal += statsBuilding.production.metal;
      req.session.currentUser.ressources.energy += statsBuilding.production.energy;
      const planetObjUpadted = await Planet.findOneAndUpdate({ "buildings._id": buildingId }, { $currentDate: { 'buildings.$.dateSinceLastCollect': true } }, { new: true });
      const userUpadted = await User.findByIdAndUpdate(req.session.currentUser._id, { $set: { "ressources.metal": req.session.currentUser.ressources.metal, "ressources.energy": req.session.currentUser.ressources.energy } }, { new: true })
      res.redirect(`/planet/${planetObjUpadted._id}`)
    } catch (e) {
      console.log("error", e)
    }
  })();

});

router.post("/buildings/:buildingId/level-up", (req, res, next) => {
  const buildingId = req.params.buildingId;
  (async () => {
    try {
      const planetObj = await Planet.findOne({ "buildings._id": buildingId }).populate("buildings.buildingTypeId");
      const buildingIndex = planetObj.buildings.findIndex((element) => element._id.toString() === buildingId);

      const statsBuilding = calcBuildingStats(planetObj.buildings[buildingIndex])

      if (statsBuilding.cost.metal <= req.session.currentUser.ressources.metal && statsBuilding.cost.energy <= req.session.currentUser.ressources.energy) {
        req.session.currentUser.ressources.metal -= statsBuilding.cost.metal;
        req.session.currentUser.ressources.energy -= statsBuilding.cost.energy;

        const planetObjUpadted = await Planet.findOneAndUpdate({ "buildings._id": buildingId }, { $inc: { 'buildings.$.level': 1 } }, { new: true });
        const userUpadted = await User.findByIdAndUpdate(req.session.currentUser._id, { $set: { "ressources.metal": req.session.currentUser.ressources.metal, "ressources.energy": req.session.currentUser.ressources.energy } }, { new: true })
      } else {
        res.redirect(`/planet/${planetObj._id}?errorMessage=noLevelUp`)
      }
      res.redirect(`/planet/${planetObj._id}`)
    } catch (e) {
      console.log("error", e)
    }
  })();

});

router.post("/buildings/:buildingId/destroy", (req, res, next) => {
  const buildingId = req.params.buildingId;
  (async () => {
    try {
      const planetObj = await Planet.findOne({ "buildings._id": buildingId }).populate("buildings.buildingTypeId");
      const buildingIndex = planetObj.buildings.findIndex((element) => element._id.toString() === buildingId);
      const planetObjUpadted = await Planet.findOneAndUpdate({ "buildings._id": buildingId }, { $pull: { buildings: { _id: buildingId } } });
      res.redirect(`/planet/${planetObj._id}`)
    } catch (e) {
      console.log("error", e)
    }
  })();

});
module.exports = router;