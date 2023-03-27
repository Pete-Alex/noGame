const express = require('express');


const BuildingType = require('../models/BuildingType.model');
const Planet = require('../models/Planet.model');
const User = require('../models/User.model');

const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get('/planet/:planetId', (req, res, next) => {
  const planetId = req.params.planetId;

  Planet.findById(planetId)
    .populate("buildings.BuildingTypeId")
    .then((response) => {     
      console.log(response);
      res.render("planet-detail", response);
    })
    .catch(e => {
      console.log("error getting the planet", e);
      next(e);
    });
})

module.exports = router;
