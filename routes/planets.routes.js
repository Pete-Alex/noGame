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


router.get("/planets", (req, res, next) => {
  Planet.find()
    .populate("owner").sort([["name", "asc"]])
    .then((response) => {
      const data = {
        planetsArray: response,
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
    isErrormessage: false,
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

      //test to display error message
      if (req.query.errorMessage != undefined) {
        data.isErrormessage = true;
        switch (req.query.errorMessage) {
          case 'noNewBuilding':
            data.messageError = "you can't create the building, you don't have enough ressources"
            break;
          case 'noLevelUp':
            data.messageError = "you can't level up the building, you don't have enough ressources"
            break;
        }
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

  (async () => {
    try {
      const buildingObj = await BuildingType.findById(newBuilding);

      const fakeDataBuilding = {
        buildingTypeId: buildingObj,
        level: 0
      }

      //calculate how much the buidling produce & cost
      const statsBuilding = calcBuildingStats(fakeDataBuilding);

      if (statsBuilding.cost.metal <= req.session.currentUser.ressources.metal && statsBuilding.cost.energy <= req.session.currentUser.ressources.energy) {

        //decrease ressources on session user
        req.session.currentUser.ressources.metal -= statsBuilding.cost.metal;
        req.session.currentUser.ressources.energy -= statsBuilding.cost.energy;

        //update planet document with a new building
        const planetToUpdate = await Planet.findByIdAndUpdate(planetId, { $push: { buildings: { buildingTypeId: newBuilding, level: 1 } } }, { new: true });

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

        res.redirect(`/planets/${planetId}`);
      } else {
        res.redirect(`/planets/${planetId}?errorMessage=noNewBuilding`);
      }

    } catch (e) {
      console.log("error", e);
    }
  })();
});

module.exports = router;