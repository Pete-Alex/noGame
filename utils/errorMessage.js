function checkErrorMessage(query, data) {
    if (query.errorMessage != undefined) {
        data.isErrormessage = true;
        switch (query.errorMessage) {
            case 'noNewPlanet':
                data.messageError = "you can't buy the planet, you don't have enough ressources"
                break;
            case 'noNewBuilding':
                data.messageError = "you can't create the building, you don't have enough ressources"
                break;
            case 'noLevelUp':
                data.messageError = "you can't level up the building, you don't have enough ressources"
                break;
            case 'noPlanetName':
                data.messageError = "you need to have a name for the planet"

        }
    }
    return data;
}

module.exports = checkErrorMessage;