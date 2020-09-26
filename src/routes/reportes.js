const { response } = require("express");
const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fs = require("fs-extra");

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/add-reportes", isLoggedIn, (req, res) => {
  res.render("reportes/add-report");
});

// RUTAS DE REPORTES
router.post("/add-reportes", isLoggedIn, async (req, res) => {
  const {
    ubicacion_reportes,
    tipo_denuncia_reportes,
    descripcion_reportes,
    evento_reportes,
  } = req.body;
  /*const result1 = await cloudinary.v2.uploader.upload(
    req.files["evidencia_reportes"][0].path
  );
  const result2 = await cloudinary.v2.uploader.upload(
    req.files["evidencia_reportes"][1].path
  );
  const result3 = await cloudinary.v2.uploader.upload(
    req.files["evidencia_reportes"][2].path
  );
  const result4 = await cloudinary.v2.uploader.upload(
    req.files["evidencia_reportes"][3].path
  );

  const imagesURl = [result1.url, result2.url, result3.url, result4.url];
  const imgToBD = imagesURl.toString();*/
  const newReporte = {
    ubicacion_reportes,
    tipo_denuncia_reportes,
    descripcion_reportes,
    user_id: req.user.id,
    evento_reportes,
  };
  await pool.query("INSERT INTO reportes set ?", [newReporte]);

  /*await fs.unlink(req.files["evidencia_reportes"][0].path);
  await fs.unlink(req.files["evidencia_reportes"][1].path);
  await fs.unlink(req.files["evidencia_reportes"][2].path);
  await fs.unlink(req.files["evidencia_reportes"][3].path);*/

  req.flash("success", "Reporte enviado correctamente");
  res.redirect("/reportes");
});

router.get("/", isLoggedIn, async (req, res) => {
  const reportes = await pool.query(
    "SELECT * FROM reportes WHERE user_id = ?",
    [req.user.id]
  );
  console.log(reportes);
  res.render("reportes/list", { reportes });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM reportes WHERE ID = ?", [id]);
  req.flash("success", "Reporte eliminado correctamente");
  res.redirect("/reportes");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const reportes = await pool.query("SELECT * FROM reportes WHERE id = ?", [
    id,
  ]);

  res.render("reportes/edit", { reportes: reportes[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const {
    evidencia_reportes,
    ubicacion_reportes,
    tipo_denuncia_reportes,
    descripcion_reportes,
  } = req.body;
  const newReporte = {
    evidencia_reportes,
    ubicacion_reportes,
    tipo_denuncia_reportes,
    descripcion_reportes,
  };
  await pool.query("UPDATE reportes set ? WHERE id = ?", [newReporte, id]);
  req.flash("success", "Reporte editado correctamente");
  res.redirect("/reportes");
});

router.get("/list-reportados", isLoggedIn, async (req, res) => {
  const reportados = await pool.query(
    "SELECT * FROM reportes WHERE tipo_denuncia_reportes = 'reporte' AND user_id = ?",
    [req.user.id]
  );
  res.render("reportes/list-reportes", { reportados });
});

// RUTAS DE DENUNCIAS
router.get("/add-denuncias", isLoggedIn, (req, res) => {
  res.render("reportes/add-denun");
});
router.post("/add-denuncias", isLoggedIn, async (req, res) => {
  const {
    evidencia_reportes,
    ubicacion_reportes,
    tipo_denuncia_reportes,
    descripcion_reportes,
    evento_reportes,
  } = req.body;
  const result1 = await cloudinary.v2.uploader.upload(
    req.files["evidencia_reportes"][0].path
  );
  const result2 = await cloudinary.v2.uploader.upload(
    req.files["evidencia_reportes"][1].path
  );
  const result3 = await cloudinary.v2.uploader.upload(
    req.files["evidencia_reportes"][2].path
  );
  const result4 = await cloudinary.v2.uploader.upload(
    req.files["evidencia_reportes"][3].path
  );

  const imagesURl = [result1.url, result2.url, result3.url, result4.url];
  const imgToBD = imagesURl.toString();
  const newReporte = {
    evidencia_reportes: imgToBD,
    ubicacion_reportes,
    tipo_denuncia_reportes,
    descripcion_reportes,
    user_id: req.user.id,
    evento_reportes,
  };
  await pool.query("INSERT INTO reportes set ?", [newReporte]);

  await fs.unlink(req.files["evidencia_reportes"][0].path);
  await fs.unlink(req.files["evidencia_reportes"][1].path);
  await fs.unlink(req.files["evidencia_reportes"][2].path);
  await fs.unlink(req.files["evidencia_reportes"][3].path);
  req.flash("success", "Denuncia enviada correctamente");
  res.redirect("/reportes");
});

router.get("/list-denunciados", isLoggedIn, async (req, res) => {
  const denunciados = await pool.query(
    "SELECT * FROM reportes WHERE tipo_denuncia_reportes = 'denuncia' AND user_id = ?",
    [req.user.id]
  );
  res.render("reportes/list-denuncias", { denunciados });
});

// RUTAS DE PQRS
/*
router.get("/list-pqrs", isLoggedIn, async (req, res) => {
  const pqrs = await pool.query(
    "SELECT * FROM reportes WHERE tipo_denuncia_reportes = 'pqrs' AND user_id = ?",
    [req.user.id]
  );
  res.render("reportes/list-pqrs", { pqrs });
});
*/

module.exports = router;
