const express = require("express");
const router = express.Router();
const cursosController = require("../controllers/cursos.controller");

// endpoints REST
router.get("/", cursosController.obtenerCursos); //api/cursos
router.get("/:id", cursosController.obtenerCursoPorId);
router.post("/", cursosController.crearCurso);
router.put("/:id", cursosController.actualizarCurso);
router.delete("/:id", cursosController.eliminarCurso);

module.exports = router;
