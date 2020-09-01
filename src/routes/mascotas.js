const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fs = require("fs-extra");

const dbPool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/add", isLoggedIn, async (req, res) => {
  const especies = await dbPool.query("SELECT * FROM especies");
  res.render("mascotas/add", {
    especies1: especies[0],
    especies2: especies[1],
    especies3: especies[2],
    especies4: especies[3],
  });
});

router.post("/add", isLoggedIn, async (req, res) => {
  const {
    imagen_mascota,
    nombre_mascota,
    padrinazgo_mascota,
    direccion_mascota,
    especie_mascota,
    raza_mascota,
    nacimiento_mascota,
    tamaño_mascota,
    microchip_mascota,
    historia_clinica_mascota,
  } = req.body;
  const result = await cloudinary.v2.uploader.upload(
    req.files["imagen_mascota"][0].path
  );
  const fileUpload = req.files["historia_clinica_mascota"][0].filename;
  const newMascota = {
    imagen_mascota: result.url,
    nombre_mascota,
    padrinazgo_mascota,
    direccion_mascota,
    especie_mascota,
    raza_mascota,
    nacimiento_mascota,
    tamaño_mascota,
    microchip_mascota,
    historia_clinica_mascota: fileUpload,
    user_id: req.user.id,
  };

  await dbPool.query("INSERT INTO mascotas set ?", [newMascota]);

  await fs.unlink(req.files["imagen_mascota"][0].path);
  await fs.unlink(req.files["historia_clinica_mascota"][0].path);

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
  const {
    nombre_mascota,
    padrinazgo_mascota,
    direccion_mascota,
    especie_mascota,
    raza_mascota,
    nacimiento_mascota,
    tamaño_mascota,
    microchip_mascota,
    historia_clinica_mascota,
  } = req.body;
  const newMascota = {
    nombre_mascota,
    padrinazgo_mascota,
    direccion_mascota,
    especie_mascota,
    raza_mascota,
    nacimiento_mascota,
    tamaño_mascota,
    microchip_mascota,
    historia_clinica_mascota,
  };
  await dbPool.query("UPDATE mascotas set ? WHERE id = ?", [newMascota, id]);
  req.flash("success", "Mascota editada correctamente");
  res.redirect("/mascotas");
});

module.exports = router;
