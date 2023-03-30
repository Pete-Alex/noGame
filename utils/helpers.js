const hbs = require("hbs");
const feather = require("feather-icons");

function initHelpers() {
  hbs.registerHelper("icon", function (iconName) {
    iconName = iconName.toString();
    return new hbs.SafeString(feather.icons[iconName].toSvg());
  });

  hbs.registerHelper("returnLength", function (array) {
    return array.length;
  });

  hbs.registerHelper("floorNumber", function (num) {
    return Math.floor(num);
  });

  hbs.registerHelper("returnArrayLength", function (arr) {
    return arr.length;
  });

  hbs.registerHelper("returnImgName", function (obj) {
    let arr;
    let type;
    let counter;
    const max = 3;

    arr = obj.name.split(" ");
    arr[0] = arr[0].toLowerCase();
    type = arr[0] + arr[1];

    counter = Math.ceil(obj.level / 3);
    counter > max ? (counter = max) : (counter = counter);
    return `${type}-${counter}.png`;
  });
}

module.exports = initHelpers;
