require("dotenv").config(); // ℹ️ Gets access to environment variables/settings
require("./db"); // ℹ️ Connects to the database
const express = require("express"); // Handles http requests (express is node js framework)
const app = express();
const hbs = require("hbs"); // Handles the handlebars
const initHelpers = require("./utils/helpers");

require("./config")(app); // ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config/session.config")(app);

// default value for title local
const projectName = "NoGame";

app.locals.appTitle = `${projectName}`;

hbs.registerPartials(__dirname + "/views/partials");

initHelpers();
//
// ROUTES
//
app.use("/", require("./routes/index.routes"));
app.use("/", require("./routes/planets.routes"));
app.use("/", require("./routes/buildings.routes"));
app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/search.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
