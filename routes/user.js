import express from "express";

const route = express.Router();

import {
  getAllUser,
  insertUser,
  deleteUser,
  getUser,
  updateUser,
} from "../services/user.js";

import { find } from "geo-tz";
import { DateTime } from "luxon";

route.get("/user/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = id ? await getUser(id) : await getAllUser();
    res.json({ rows: result.rows });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

route.post("/user", async (req, res, next) => {
  try {
    const { location } = req.body;
    const zones = find(location.split(",")[0], location.split(",")[1]);
    const result = await insertUser({
      ...req.body,
      zone: zones[0],
    });

    res.json({
      rows: result.rows,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

route.delete("/user/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await deleteUser(id);

    res.json({
      rows: result.rows,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

route.put("/user/:id", async (req, res, next) => {
  try {
    const { location } = req.body;
    const zones = find(location.split(",")[0], location.split(",")[1]);
    const result = await updateUser({ ...req.body, zone: zones[0] });

    if (result.rowCount === 0) {
      res.status(204).json({ rows: result.rows });
      return;
    }

    res.json({
      rows: result.rows,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default route;
