const express = require('express');

const BuildingType = require('../models/BuildingType.model');
const Planet = require('../models/Planet.model');
const User = require('../models/User.model');

const { gapTimeCalculation, checkPlanetUser, displayPlanetDetail } = require('../utils/renderPlanet.js');
const { costMine, productionMine, costPowerPlant, productionPowerPlant } = require('../utils/buildingTypeEquation.js');

const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});


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
    .catch(e => {
      console.log("error getting the planet", e);
      next(e);
    });
});

router.post("/planet/:planetId/change-name", (req, res, next) =>{
  console.log(req.body.name);
  const newPlanetName = req.body.name;
  const planetId = req.params.planetId;
  Planet.findByIdAndUpdate(planetId, { name: newPlanetName }, { new: true })
  .then((response) =>{
    res.redirect(`/planet/${response.id}`); //redirect to book details page
  })
  .catch(e => {
    console.log("error changing planet Name", e);
    next(e);
  });
});


module.exports = router;
