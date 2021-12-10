const express = require("express");

const route = express.Router();

route.get("/user", function (req, res, next) {
  res.json({ path: "/user", method: req.method });
});

route.post("/user", function (req, res, next) {
  res.json({ path: "/user", method: req.method });
});

route.delete("/user", function (req, res, next) {
  res.json({ path: "/user", method: req.method });
});

route.put("/user", function (req, res, next) {
  res.json({ path: "/user", method: req.method });
});

module.exports = route;
