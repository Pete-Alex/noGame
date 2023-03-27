const express = require("express");
const mongoose = require("mongoose");

const { isUserLoggedIn, isUserLoggedOut } = require("../middleware/logged.js");

const router = express.Router();

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// GET /auth/signup
router.get("/signup", isUserLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isUserLoggedOut, (req, res) => {
  const { username, email, password } = req.body;
  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  if (password.length < 10) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 10 characters long.",
    });
    return;
  }

  //   ! This regular expression checks password for special characters and minimum length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 10 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Create a new user - start by hashing the password
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((user) => {
      res.redirect("/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/login", isUserLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isUserLoggedOut, (req, res, next) => {
  const {email, password } = req.body;

  // Check that username, email, and password are provided
  if (email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcryptjs
        .compare(password, user.passwordHash)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isUserLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;
