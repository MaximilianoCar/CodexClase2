const express = require("express");
const cors = require("cors");
const cursosRoutes = require("./routes/cursos.routes");
const facilitadoresRoutes = require("./routes/facilitadores.routes");

const app = express();
// Configurar CORS
app.use(cors());
// middlewares global
app.use(express.json());

// rutas modularizadas
app.use("/api/cursos", cursosRoutes);
app.use("/api/facilitadores", facilitadoresRoutes);

// manejo genérico de rutas no encontradas (404 Honesto)
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
