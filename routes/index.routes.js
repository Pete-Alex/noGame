const express = require("express");

const BuildingType = require("../models/BuildingType.model");
const Planet = require("../models/Planet.model");
const User = require("../models/User.model");

const { gapTimeCalculation } = require("../utils/renderPlanet.js");
const {
  costMine,
  productionMine,
  costPowerPlant,
  productionPowerPlant,
} = require("../utils/buildingTypeEquation.js");

const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

// GET planet by id
router.get("/planet/:planetId", (req, res, next) => {
  const planetId = req.params.planetId;
  const infoBuildings = [];
  Planet.findById(planetId)
    .populate("buildings.buildingTypeId")
    .populate("owner")
    .then((response) => {
      response["buildings"].forEach((element) => {
        //console.log(`element.buildingTypeId.costEquation: ${element.buildingTypeId.costEquation}`)
        const productionEquation = eval(
          `${element.buildingTypeId.productionEquation}(${element.level})`
        );
        const costEquation = eval(
          `${element.buildingTypeId.costEquation}(${element.level})`
        );
        //console.log(productionEquation);

        const newBuilding = {
          name: element.buildingTypeId.name,
          description: element.buildingTypeId.description,
          level: element.level,
          production: {
            metal:
              productionEquation.metal *
              gapTimeCalculation(element.dateSinceLastCollect),
            energy:
              productionEquation.energy *
              gapTimeCalculation(element.dateSinceLastCollect),
          },
          cost: {
            metal: costEquation.metal,
            energy: costEquation.energy,
          },
        };
        console.log(newBuilding);
        infoBuildings.push(newBuilding);
      });

      //console.log(gapCalculation(response.buildings[0].dateSinceLastCollect));
      res.render("planet-detail", {
        user: req.session.currentUser,
        planetInfo: response,
        infoBuildings: infoBuildings,
      });
    })
    .catch((e) => {
      console.log("error getting the planet", e);
      next(e);
    });
});

module.exports = router;
