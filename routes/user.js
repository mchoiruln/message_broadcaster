const express = require("express");

const route = express.Router();

const { db, getAllUser, insertUser } = require("../services/user");

route.get("/user", async (req, res, next) => {
  try {
    const result = await getAllUser();
    res.json({ rows: result.rows });
    return;
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
});

route.post("/user", async (req, res, next) => {
  const { firstname, lastname, birthday_date, location, zone } = req.body;
  try {
    const result = await insertUser(
      firstname,
      lastname,
      birthday_date,
      location,
      zone
    );
    res.json({ rows: result.rows });
    return;
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
});

route.delete("/user", function (req, res, next) {
  res.json({ path: "/user", method: req.method });
});

route.put("/user", function (req, res, next) {
  res.json({ path: "/user", method: req.method });
});

module.exports = route;
