function costMine(number) {
    const costData = {
        metal: 60 * (number + 1) * Math.pow(1.5, number + 1 - 1),
        energy: 10 * (number + 1) * Math.pow(1.1, number + 1)
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
        metal: 70 * (number + 1) * Math.pow(1.5, number + 1),
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