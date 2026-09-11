-- Insertar Categorías
INSERT OR IGNORE INTO categorias (id, nombre, descripcion) VALUES 
(1, 'Programación y Web', 'Cursos de desarrollo de software y tecnologías web'),
(2, 'Idiomas', 'Cursos para aprendizaje de lenguas extranjeras'),
(3, 'Habilidades Blandas', 'Desarrollo personal, oratoria y comunicación eficaz');

-- Insertar Facilitadores
INSERT OR IGNORE INTO facilitadores (id, nombre, email) VALUES 
(1, 'Daniel Moros', 'daniel.moros@email.com'),
(2, 'Maximiliano Carrillo', 'maximiliano.carrillo@email.com'),
(3, 'Harry Potter', 'harry.potter@email.com');

-- Insertar Estudiantes
INSERT OR IGNORE INTO estudiantes (id, nombre, email) VALUES 
(1, 'Gabriel Silva', 'gabriel.silva@email.com'),
(2, 'Valeria Gómez', 'valeria.gomez@email.com'),
(3, 'Luis Fernández', 'luis.fernandez@email.com');

-- Insertar Cursos
INSERT OR IGNORE INTO cursos (id, titulo, precio, facilitador_id, descripcion) VALUES 
(   1, 'Desarrollo Web Nivel 1: HTML, CSS y JavaScript', 49.99, 1, 'Curso básico de desarrollo web con HTML, CSS y JavaScript'),
(2, 'Desarrollo Web Nivel 2: Node.js, Express y Bases de Datos', 79.99, 1, 'Curso avanzado de desarrollo web con Node.js, Express y Bases de Datos'),
(3, 'Inglés Conversacional Intermedio', 59.99, 2, 'Curso de inglés conversacional para niveles intermedios'),
(4, 'Oratoria y Dominio Escénico', 39.99, 3, 'Curso de oratoria y dominio escénico');

-- Relacionar Cursos con Categorías (N:M)
INSERT OR IGNORE INTO cursos_categorias (curso_id, categoria_id) VALUES 
(1, 1), -- Dev Web Nivel 1 -> Programación y Web
(2, 1), -- Dev Web Nivel 2 -> Programación y Web
(3, 2), -- Inglés -> Idiomas
(4, 3); -- Oratoria -> Habilidades Blandas

-- Inscripciones de Estudiantes en Cursos (N:M)
INSERT OR IGNORE INTO estudiantes_cursos (estudiante_id, curso_id, estado) VALUES 
(1, 1, 'completado'), -- Gabriel completó Dev Web Nivel 1
(1, 2, 'activo'),     -- Gabriel está haciendo Dev Web Nivel 2
(2, 3, 'activo'),     -- Valeria cursa Inglés
(3, 4, 'activo');     -- Luis cursa Oratoria