const express = require('express');

const BuildingType = require('../models/BuildingType.model');
const Planet = require('../models/Planet.model');
const User = require('../models/User.model');

const { gapCalculation } = require('../utils/gapCalculation.js');

const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get('/planet/:planetId', (req, res, next) => {
  const planetId = req.params.planetId;

  Planet.findById(planetId)
    .populate("buildings.buildingTypeId")
    .then((response) => {   
      console.log(gapCalculation(response.buildings[0].dateSinceLastCollect));
      res.render("planet-detail", response);
    })
    .catch(e => {
      console.log("error getting the planet", e);
      next(e);
    });
})

module.exports = router;
