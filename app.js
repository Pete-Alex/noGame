require("dotenv").config(); // ℹ️ Gets access to environment variables/settings
require("./db"); // ℹ️ Connects to the database
const express = require("express"); // Handles http requests (express is node js framework)
const hbs = require("hbs"); // Handles the handlebars
const app = express();


require("./config")(app); // ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config/session.config')(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "noGame";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

//
// ROUTES
//
app.use("/", require("./routes/index.routes"));
app.use("/", require("./routes/auth.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
