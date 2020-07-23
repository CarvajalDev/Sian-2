const express = require("express");
const router = express.Router();

const dbPool = require("../database");
const pool = require("../database");

router.get("/add", (req, res) => {
  res.render("mascotas/add");
});

router.post("/add", async (req, res) => {
  const { nombre_mascota, direccion_mascota, descripcion } = req.body;
  const newMascota = {
    nombre_mascota,
    direccion_mascota,
    descripcion,
  };

  await dbPool.query("INSERT INTO mascotas set ?", [newMascota]);
  res.redirect("/mascotas");
});

router.get("/", async (req, res) => {
  const mascotas = await dbPool.query("SELECT * FROM mascotas");
  res.render("mascotas/list", { mascotas });
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await dbPool.query("DELETE FROM mascotas WHERE ID = ?", [id]);
  res.redirect("/mascotas");
});

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const mascotas = await dbPool.query("SELECT * FROM mascotas WHERE id = ?", [
    id,
  ]);
  console.log(mascotas[0]);
  res.render("mascotas/edit", { mascota: mascotas[0] });
});

router.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_mascota, direccion_mascota, descripcion } = req.body;
  const newMascota = {
    nombre_mascota,
    direccion_mascota,
    descripcion,
  };
  await dbPool.query("UPDATE mascotas set ? WHERE id = ?", [newMascota, id]);
  res.redirect("/mascotas");
});

module.exports = router;
