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

function displayPlanetDetail(sessionUser, databaseReponse) {
    let isCurrentUserOwnPlanet = false;
    const infoBuildings = [];
    if (sessionUser != undefined) {
        isCurrentUserOwnPlanet = checkPlanetUser(sessionUser._id, databaseReponse.owner._id.toString())
    }

    databaseReponse["buildings"].forEach((element) => {
        const productionEquation = eval(`${element.buildingTypeId.productionEquation}(${element.level})`);
        const costEquation = eval(`${element.buildingTypeId.costEquation}(${element.level})`);
        const newBuilding = {
            name: element.buildingTypeId.name,
            description: element.buildingTypeId.description,
            level: element.level,
            production: {
                metal: productionEquation.metal * gapTimeCalculation(element.dateSinceLastCollect),
                energy: productionEquation.energy * gapTimeCalculation(element.dateSinceLastCollect)
            },
            cost: {
                metal: costEquation.metal,
                energy: costEquation.energy
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
    displayPlanetDetail
};