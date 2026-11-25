
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { Pool } = require("pg");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com")
    ? { rejectUnauthorized: false }
    : undefined
});

app.get("/", (req, res) => {
  res.json({
    empresa: "La Espiga Dorada",
    mensaje: "Servidor funcionando correctamente",
    estado: "activo"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS fecha");
    res.json({
      servidor: "activo",
      baseDeDatos: "conectada",
      fecha: result.rows[0].fecha
    });
  } catch (error) {
    console.error("Error de conexion:", error.message);
    res.status(503).json({
      servidor: "activo",
      baseDeDatos: "sin conexion"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`La Espiga Dorada funcionando en puerto ${PORT}`);
});
