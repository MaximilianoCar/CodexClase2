-- Habilitar el soporte de Claves Foráneas en SQLite
PRAGMA foreign_keys = ON;

-- 1. Tablas Principales (Entidades)

CREATE TABLE IF NOT EXISTS facilitadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS cursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    precio REAL NOT NULL CHECK (precio >= 0),
    facilitador_id INTEGER NOT NULL,
    descripcion TEXT NOT NULL DEFAULT 'Descripción no proporcionada',
    FOREIGN KEY (facilitador_id) REFERENCES facilitadores(id) ON DELETE CASCADE
);

-- 2. Tablas Intermedias (Relaciones N:M)

CREATE TABLE IF NOT EXISTS cursos_categorias (
    curso_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    PRIMARY KEY (curso_id, categoria_id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS estudiantes_cursos (
    estudiante_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado TEXT CHECK (estado IN ('activo', 'completado', 'cancelado')) DEFAULT 'activo',
    PRIMARY KEY (estudiante_id, curso_id),
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);
