const { getDB } = require("../config/db");

// función auxiliar de validación (Se mantiene igual)
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
    const db = getDB();
    const cursos = await db.all("SELECT * FROM cursos");
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/cursos/:id
const obtenerCursoPorId = async (req, res) => {
  const id = (req.params.id);

  //if (!Number.isInteger(id) || id < 1) {
  //  return res.status(400).json({ error: "El ID debe ser un número entero válido" });
  //}

  try {
    const db = getDB();
    // db.get() retorna un único objeto o undefined
    //const curso = await db.get("SELECT * FROM cursos WHERE id = ?", [id]);
    const curso = await db.all(`SELECT * FROM cursos WHERE id = ${id}`);

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
    const db = getDB();
    // db.run() ejecuta consultas que alteran datos (INSERT, UPDATE, DELETE)
    const result = await db.run(
      "INSERT INTO cursos (titulo, precio, facilitador_id) VALUES (?, ?, ?)",
      [nombre.trim(), 0, 1] // NOTA: Asignamos valores por defecto si no vienen en la petición
    );

    const nuevoCurso = {
      id: result.lastID, // SQLite autogenera el id
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    };

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
    const db = getDB();
    const curso = await db.get("SELECT * FROM cursos WHERE id = ?", [id]);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Mantenemos valores existentes si alguno no es enviado
    const nuevoNombre = nombre !== undefined ? nombre.trim() : curso.titulo;
    
    await db.run(
      "UPDATE cursos SET titulo = ? WHERE id = ?",
      [nuevoNombre, id]
    );

    const cursoActualizado = await db.get("SELECT * FROM cursos WHERE id = ?", [id]);
    res.json(cursoActualizado);
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
    const db = getDB();
    const result = await db.run("DELETE FROM cursos WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

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