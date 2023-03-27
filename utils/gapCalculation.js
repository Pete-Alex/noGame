function gapCalculation(time) {
    var epochDate = new Date(time);
    epochDate = epochDate.getTime();

    const currentDate = Date.now()

    return (currentDate - epochDate)/(1000*60*60);
}

module.exports = {
    gapCalculation
};