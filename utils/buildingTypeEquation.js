function costMine(number) {
    const costData = {
        metal: 60 * number * Math.pow(1.5, number - 1),
        energy: 10 * number * Math.pow(1.1, number)
    };
    return costData
}
function productionMine(number) {
    const productionData = {
        metal: 30 * number * Math.pow(1.1, number),
        energy: 0
    };
    return productionData
}


function costPowerPlant(number) {
    const costData = {
        metal: 70 * number * Math.pow(1.5, number),
        energy: 0
    };
    return costData
}
function productionPowerPlant(number) {
    const productionData = {
        metal: 0,
        energy: 20 * number * Math.pow(1.1, number)
    };
    return productionData
}


module.exports = {
    costMine,
    productionMine,
    costPowerPlant,
    productionPowerPlant
};