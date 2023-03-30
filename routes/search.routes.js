const express = require("express");

const Planet = require("../models/Planet.model");
const User = require("../models/User.model");

const router = express.Router();

router.get("/search", (req, res, next) => {
  let data = {};
  data.query = req.query.search;

  User.find({ username: { $regex: req.query.search, $options: "i" } })
    .sort({ username: 1 })
    .populate("planetListOwned")
    .then((result) => {
      data.users = result;
      return Planet.find({
        name: { $regex: req.query.search, $options: "i" },
      })
        .populate("owner")
        .sort({ name: 1 })
        .catch((err) => next(err));
    })
    .then((result) => {
      data.planets = result;
      data.user = req.session.currentUser;
      console.log(data);
      res.render("search-results", data);
    })
    .catch((err) => next(err));
});

module.exports = router;
