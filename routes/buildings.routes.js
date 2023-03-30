const express = require("express");

//models
const BuildingType = require("../models/BuildingType.model");
const Planet = require("../models/Planet.model");
const User = require("../models/User.model");

//utils functions

const {
  gapTimeCalculation,
  checkPlanetUser,
  calcBuildingStats,
  displayPlanetDetail,
} = require("../utils/renderPlanet.js");

const router = express.Router();

router.post("/buildings/:buildingId/harvest", (req, res, next) => {
  const buildingId = req.params.buildingId;
  (async () => {
    try {
      //query to find the planet related to the building
      const planetObj = await Planet.findOne({
        "buildings._id": buildingId,
      }).populate("buildings.buildingTypeId");

      //find position of the buidling in the array
      const buildingIndex = planetObj.buildings.findIndex(
        (element) => element._id.toString() === buildingId
      );

      //calculate how much the buidling produce & cost
      const statsBuilding = calcBuildingStats(
        planetObj.buildings[buildingIndex]
      );

      //increase ressources on session user
      req.session.currentUser.ressources.metal += statsBuilding.production.metal;
      req.session.currentUser.ressources.energy += statsBuilding.production.energy;

      //update of planet document to set the collect date at now
      const planetObjUpadted = await Planet.findOneAndUpdate(
        { "buildings._id": buildingId },
        { $currentDate: { "buildings.$.dateSinceLastCollect": true } },
        { new: true }
      );

      //update user with new ressources values
      const userUpadted = await User.findByIdAndUpdate(
        req.session.currentUser._id,
        {
          $set: {
            "ressources.metal": req.session.currentUser.ressources.metal,
            "ressources.energy": req.session.currentUser.ressources.energy,
          },
        },
        { new: true }
      );

      res.redirect(`/planets/${planetObjUpadted._id}`);

    } catch (e) {
      console.log("error", e);
    }
  })();
});


router.post("/buildings/:buildingId/level-up", (req, res, next) => {
  const buildingId = req.params.buildingId;
  (async () => {
    try {
      //query to find the planet related to the building
      const planetObj = await Planet.findOne({
        "buildings._id": buildingId,
      }).populate("buildings.buildingTypeId");

      //find position of the buidling in the array
      const buildingIndex = planetObj.buildings.findIndex(
        (element) => element._id.toString() === buildingId
      );

      //calculate how much the buidling produce & cost
      const statsBuilding = calcBuildingStats(
        planetObj.buildings[buildingIndex]
      );

      //test if user has enough ressource
      if (
        statsBuilding.cost.metal <= req.session.currentUser.ressources.metal &&
        statsBuilding.cost.energy <= req.session.currentUser.ressources.energy
      ) {

        //decrease ressources on session user
        req.session.currentUser.ressources.metal -= statsBuilding.cost.metal;
        req.session.currentUser.ressources.energy -= statsBuilding.cost.energy;

        //update planet document to add new building(level1) on the array
        const planetObjUpadted = await Planet.findOneAndUpdate(
          { "buildings._id": buildingId },
          { $inc: { "buildings.$.level": 1 } },
          { new: true }
        );

        //update user with new ressources values
        const userUpadted = await User.findByIdAndUpdate(
          req.session.currentUser._id,
          {
            $set: {
              "ressources.metal": req.session.currentUser.ressources.metal,
              "ressources.energy": req.session.currentUser.ressources.energy,
            },
          },
          { new: true }
        );
        res.redirect(`/planets/${planetObj._id}`);

      } else {
        //if user has not enough ressources, display error message with query URL
        res.redirect(`/planets/${planetObj._id}?errorMessage=noLevelUp`);

      }

    } catch (e) {
      console.log("error", e);
    }
  })();
});


router.post("/buildings/:buildingId/destroy", (req, res, next) => {
  const buildingId = req.params.buildingId;
  (async () => {
    try {
      //find planet document that contains the building
      const planetObj = await Planet.findOne({
        "buildings._id": buildingId,
      }).populate("buildings.buildingTypeId");

      //remove the building from the array on the document
      const planetObjUpadted = await Planet.findOneAndUpdate(
        { "buildings._id": buildingId },
        { $pull: { buildings: { _id: buildingId } } }
      );

      res.redirect(`/planets/${planetObj._id}`);
    } catch (e) {
      console.log("error", e);
    }
  })();
});

module.exports = router;