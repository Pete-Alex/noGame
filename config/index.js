const express = require("express"); // We reuse this import in order to have access to the `body` property in requests
const logger = require("morgan"); // ℹ️ Responsible for the messages you see in the terminal as requests are coming in
const cookieParser = require("cookie-parser"); // ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
const favicon = require("serve-favicon"); // ℹ️ Serves a custom favicon on each request
const path = require("path"); // ℹ️ global package used to `normalize` paths amongst different operating systems

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.set("views", path.join(__dirname, "..", "views")); // Normalizes the path to the views folder
  app.set("view engine", "hbs"); // Sets the view engine to handlebars
  app.use(express.static(path.join(__dirname, "..", "public")));   // Handles access to the public folder

  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))); // Handles access to the favicon
};
