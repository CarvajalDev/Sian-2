const { response } = require("express");
const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/add-reportes", isLoggedIn, (req, res) => {
  res.render("reportes/add-report");
});

// RUTAS DE Reportes
router.post("/add-reportes", isLoggedIn, async (req, res) => {
  const {
    evidencia_reportes,
    ubicacion_reportes,
    tipo_denuncia_reportes,
    descripcion_reportes,
    evento_reportes,
  } = req.body;
  const newReporte = {
    evidencia_reportes,
    ubicacion_reportes,
    tipo_denuncia_reportes,
    descripcion_reportes,
    user_id: req.user.id,
    evento_reportes,
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

router.get("/list-reportados", isLoggedIn, async (req, res) => {
  const reportados = await pool.query(
    "SELECT * FROM reportes WHERE tipo_denuncia_reportes = 'animales perdidos o extraviados' OR tipo_denuncia_reportes = 'solo reporte' AND user_id = ?",
    [req.user.id]
  );
  res.render("reportes/list-reportes", { reportados });
});

// RUTAS DE DENUNCIAS
/*router.get("/add-denuncias", isLoggedIn, (req, res) => {
  res.render("reportes/add-denun");
});
router.post("/add-denuncias", isLoggedIn, async (req, res) => {
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
  req.flash("success", "Denuncia enviada correctamente");
  res.redirect("/reportes");
});
*/
router.get("/list-denunciados", isLoggedIn, async (req, res) => {
  const denunciados = await pool.query(
    "SELECT * FROM reportes WHERE tipo_denuncia_reportes = 'animales maltratados' AND user_id = ?",
    [req.user.id]
  );
  res.render("reportes/list-denuncias", { denunciados });
});

// RUTAS DE PQRS

router.get("/list-pqrs", isLoggedIn, async (req, res) => {
  const pqrs = await pool.query(
    "SELECT * FROM reportes WHERE tipo_denuncia_reportes = 'pqrs' AND user_id = ?",
    [req.user.id]
  );
  res.render("reportes/list-pqrs", { pqrs });
});

module.exports = router;
