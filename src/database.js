const mysql = require("mysql");
const { promisify } = require("util");

const { database } = require("./keys");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("CONEXION DE LA BASE DE DATOS CERRADA");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("BASE DE DATOS TIENE MUCHAS CONEXIONES");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("CONEXION A BASE DE DATOS RECHAZADA");
    }
  }

  if (connection) connection.release();
  console.log("Base de Datos Conectada");
  return;
});

//Convirtiendo callbacks a promesas
pool.query = promisify(pool.query);

module.exports = pool;
