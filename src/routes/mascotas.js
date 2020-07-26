const express = require("express");
const router = express.Router();

const dbPool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("mascotas/add");
});

router.post("/add", isLoggedIn, async (req, res) => {
  const { nombre_mascota, direccion_mascota, descripcion } = req.body;
  const newMascota = {
    nombre_mascota,
    direccion_mascota,
    descripcion,
    user_id: req.user.id,
  };

  await dbPool.query("INSERT INTO mascotas set ?", [newMascota]);
  req.flash("success", "mascota guardada correctamente");
  res.redirect("/mascotas");
});

router.get("/", isLoggedIn, async (req, res) => {
  const mascotas = await dbPool.query(
    "SELECT * FROM mascotas WHERE user_id = ?",
    [req.user.id]
  );
  res.render("mascotas/list", { mascotas });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await dbPool.query("DELETE FROM mascotas WHERE id = ?", [id]);
  req.flash("success", "Mascota eliminada correctamente");
  res.redirect("/mascotas");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const mascotas = await dbPool.query("SELECT * FROM mascotas WHERE id = ?", [
    id,
  ]);
  res.render("mascotas/edit", { mascota: mascotas[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { nombre_mascota, direccion_mascota, descripcion } = req.body;
  const newMascota = {
    nombre_mascota,
    direccion_mascota,
    descripcion,
  };
  await dbPool.query("UPDATE mascotas set ? WHERE id = ?", [newMascota, id]);
  req.flash("success", "Mascota editada correctamente");
  res.redirect("/mascotas");
});

module.exports = router;
