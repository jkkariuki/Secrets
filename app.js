//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
const User = require("./models/User");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  User.findOne({ email: req.body.username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (!foundUser) {
        const newUser = new User({
          email: req.body.username,
          password: req.body.password,
        });
        newUser.save(function (err) {
          if (!err) {
            res.render("secrets");
          } else {
            console.log(err);
          }
        });
      } else {
        console.log("Username already exists");
        res.redirect("/");
      }
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        console.log(foundUser);
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen("3000", function () {
  console.log("Server running on port 3000");
});
