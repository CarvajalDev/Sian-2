const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("reportes/add");
});

router.post("/add", isLoggedIn, async (req, res) => {
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
    user_id: req.user.id,
  };
  await pool.query("INSERT INTO reportes set ?", [newReporte]);
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

router.get("reportes/reportes", isLoggedIn, async (req, res) => {});

module.exports = router;
