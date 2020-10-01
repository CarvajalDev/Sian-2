const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("auth/reset", {});
});

router.get("/:id", async (req, res) => {
  res.render("auth/reset", {});
  const sendToken = req.headers;

  console.log(sendToken);

  /*const { id } = req.params;
  const mascotas = await dbPool.query("SELECT * FROM mascotas WHERE id = ?", [
    id,
  ]);
  const especies = await dbPool.query("SELECT * FROM especies");
  const razas = await dbPool.query("SELECT nombre_raza FROM razas");
  const nombreRazas = razas.map((elegir) => {
    return elegir.nombre_raza;
  });
  res.render("mascotas/edit", {
    mascota: mascotas[0],
    raza: nombreRazas,
    especies1: especies[0],
    especies2: especies[1],
  });*/
});

module.exports = router;
