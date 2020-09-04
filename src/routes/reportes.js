const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/add", (req, res) => {
  res.render("reportes/add");
});

router.post("/add", async (req, res) => {
  const { title, url, description } = req.body;
  const newReporte = {
    title,
    url,
    description,
  };
  await pool.query("INSERT INTO reportes set ?", [newReporte]);
  res.send("received");
});

module.exports = router;
