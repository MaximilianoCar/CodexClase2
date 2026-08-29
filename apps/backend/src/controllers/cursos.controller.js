const path = require("path");
const { leerJson, escribirJson } = require("../utils/fileStorage");

const cursosPath = path.join(__dirname, "../data/cursos.json");

// Función auxiliar de validación
const validarDatosCurso = (nombre, descripcion) => {
  if (typeof nombre !== "string" || !nombre.trim()) {
    return "El campo nombre es obligatorio y debe contener texto";
  }

  if (typeof descripcion !== "string" || !descripcion.trim()) {
    return "El campo descripcion es obligatorio y debe contener texto";
  }

  return null;
}; 

const validarDatosActCurso = (nombre, descripcion) => {
  if (nombre !== undefined && (typeof nombre !== "string" || !nombre.trim())) {
    return "El campo nombre debe contener texto válido";
  }

  if (descripcion !== undefined && (typeof descripcion !== "string" || !descripcion.trim())) {
    return "El campo descripcion debe contener texto válido";
  }

  if (nombre === undefined && descripcion === undefined) {
    return "Debe enviar al menos un campo para actualizar (nombre o descripcion)";
  }

  return null;
};

// GET /api/cursos
const obtenerCursos = async (req, res) => {
  try {
    const cursos = await leerJson(cursosPath);
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/cursos/:id
const obtenerCursoPorId = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "El ID debe ser un número entero válido" });
  }

  try {
    const cursos = await leerJson(cursosPath);
    const curso = cursos.find((item) => item.id === id);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/cursos
const crearCurso = async (req, res) => {
  const { nombre, descripcion } = req.body || {};
  const errorValidacion = validarDatosCurso(nombre, descripcion);

  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  try {
    const cursos = await leerJson(cursosPath);
    const nuevoCurso = {
      id: cursos.reduce((mayorId, curso) => Math.max(mayorId, curso.id), 0) + 1,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    };

    cursos.push(nuevoCurso);
    await escribirJson(cursosPath, cursos);
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/cursos/:id
const actualizarCurso = async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, descripcion } = req.body || {};

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "El ID debe ser un número entero válido" });
  }

  const errorValidacion = validarDatosActCurso(nombre, descripcion);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  try {
    const cursos = await leerJson(cursosPath);
    const curso = cursos.find((item) => item.id === id);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // actualización condicional segura aplicando .trim() solo si el dato fue enviado
    if (nombre !== undefined) curso.nombre = nombre.trim();
    if (descripcion !== undefined) curso.descripcion = descripcion.trim();

    await escribirJson(cursosPath, cursos);
    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/cursos/:id
const eliminarCurso = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "El ID debe ser un número entero válido" });
  }

  try {
    const cursos = await leerJson(cursosPath);
    const indice = cursos.findIndex((item) => item.id === id);

    if (indice === -1) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    cursos.splice(indice, 1);
    await escribirJson(cursosPath, cursos);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerCursos,
  obtenerCursoPorId,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
};