require("dotenv").config(); // ℹ️ Gets access to environment variables/settings
require("./db"); // ℹ️ Connects to the database
const express = require("express"); // Handles http requests (express is node js framework)
const app = express();
const hbs = require("hbs"); // Handles the handlebars

require("./config")(app); // ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config/session.config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "NoGame";

app.locals.appTitle = `${projectName}`;

hbs.registerPartials(__dirname + "/views/partials");

// icon helper
const feather = require("feather-icons");

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

//
// ROUTES
//
app.use("/", require("./routes/index.routes"));
app.use("/", require("./routes/auth.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
