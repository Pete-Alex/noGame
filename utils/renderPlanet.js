const { costMine, productionMine, costPowerPlant, productionPowerPlant } = require('../utils/buildingTypeEquation.js');

function gapTimeCalculation(time) {
    var epochDate = new Date(time);
    epochDate = epochDate.getTime();

    const currentDate = Date.now()

    return (currentDate - epochDate) / (1000 * 60 * 60);
}

function checkPlanetUser(sessionUserId, planetUserId) {
    if (sessionUserId === planetUserId) {
        return true;
    } else {
        return false;
    }
}

function calcBuildingStats(buildingObj) {
    const productionEquation = eval(`${buildingObj.buildingTypeId.productionEquation}(${buildingObj.level})`);
    const costEquation = eval(`${buildingObj.buildingTypeId.costEquation}(${buildingObj.level})`);
    Math.floor()
    const data = {
        production: {
            metal: Math.floor(productionEquation.metal * gapTimeCalculation(buildingObj.dateSinceLastCollect)),
            energy: Math.floor(productionEquation.energy * gapTimeCalculation(buildingObj.dateSinceLastCollect))
        },
        cost: {
            metal: Math.floor(costEquation.metal),
            energy: Math.floor(costEquation.energy)
        }
    }
    return data;
}

function displayPlanetDetail(sessionUser, databaseReponse) {
    let isCurrentUserOwnPlanet = false;
    const infoBuildings = [];
    if (sessionUser != undefined) {
        isCurrentUserOwnPlanet = checkPlanetUser(sessionUser._id, databaseReponse.owner._id.toString())
    }

    databaseReponse["buildings"].forEach((element) => {
        const buildingStats = calcBuildingStats(element);
        const newBuilding = {
            id: element._id.toString(),
            name: element.buildingTypeId.name,
            description: element.buildingTypeId.description,
            level: element.level,
            production: {
                metal: buildingStats.production.metal,
                energy: buildingStats.production.energy
            },
            cost: {
                metal: buildingStats.cost.metal,
                energy: buildingStats.cost.energy
            }
        }
        infoBuildings.push(newBuilding);
    });
    data = { isCurrentUserOwnPlanet, infoBuildings }
    return data;
}

module.exports = {
    gapTimeCalculation,
    checkPlanetUser,
    calcBuildingStats,
    displayPlanetDetail
};