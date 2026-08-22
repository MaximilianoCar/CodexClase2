const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); //middleware para parsear el body de las peticiones en formato JSON

//arreglo de cursos
const cursos = [
    {
        id: 0,
        nombre: "Curso de BD",
        descripcion: "Aprende los fundamentos de las bases de datos",
    },
    {
        id: 1,
        nombre: "Curso de python",
        descripcion: "Desarrolla aplicaciones backend con python",
    },
    {
        id: 2,
        nombre: "Curso de Angular",
        descripcion: "Crea interfaces de usuario interactivas con Angular",
    },
];

// ruta basica
app.get("/", (req, res) => {
    res.send("Hola desde express");
});

// 1. ruta  que retorna todos los cursos tal cual
// URL: http://localhost:3000/api/cursos
app.get("/api/cursos", (req, res) => {
    res.json(cursos);
});

// 3. ruta con query params: Para búsquedas / filtros
// URL: http://localhost:3000/api/cursos/buscar?nombre=python
app.get("/api/cursos/buscar", (req, res) => {
    const { nombre } = req.query; //desestructuramos el query param nombre de la URL

    if (!nombre) {
        return res.status(400).json({
            error: "Debes proporcionar un término de búsqueda en ?nombre=",
        });
    }

    const resultados = cursos.filter((c) =>
        c.nombre.toLowerCase().includes(nombre.toLowerCase()),
    );

    res.json(resultados);
});

// 2. ruta con params: Obtiene un solo curso por su ID exacto
// URL: http://localhost:3000/api/cursos/1
app.get("/api/cursos/:id", (req, res) => {
    const id = parseInt(req.params.id); //recuerden que es necesario ya que la URL es un string y nosotros esperamos un id numerico

    if (isNaN(id)) {
        // esto es para validar que el id sea numerico, si no lo es, devolvemos un error 400 (bad request)
        return res.status(400).json({ error: "ID inválido" });
    }

    const curso = cursos.find((c) => c.id === id); //buscamos el curso con el id exacto

    if (curso) {
        res.json(curso);
    } else {
        res.status(404).json({ error: "Curso no encontrado" });
    }
});

//ruta que retorna informacion del curso
app.get("/api/info", (req, res) => {
    res.json({
        curso: "Desarrollo de aplicaciones web",
        nivel: 2,
    });
});

//La ruta /api/cursos/buscar debe ir antes de /api/cursos/:id. Si lo hacene al revés,
// Express interpretará la palabra "buscar" como si fuera el :id de la ruta con params
// e intentará hacer parseInt("buscar"), devolviéndote un error.
// por eeso recuerden que el orden de las rutas importa

//colchon de middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
