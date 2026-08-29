const API_BASE_URL = "http://localhost:3000/api";

const solicitar = async (ruta, opciones = {}) => {
    const respuesta = await fetch(`${API_BASE_URL}${ruta}`, { //construimos fetch de forma dinámica, con la ruta que le pasemos y la base url
        headers: { "Content-Type": "application/json" },
        ...opciones, // Si pasamos un método diferente (POST, PUT, DELETE) o un body, se sobreescribe o añade aquí (fetch por defecto es GET)
    });

    if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}));
        throw new Error(error.error || "No se pudo completar la solicitud");
    }

    return respuesta.status === 204 ? null : respuesta.json();
};

const obtenerCursos = () => solicitar("/cursos");

const crearCurso = (curso) => solicitar("/cursos", {
    method: "POST",
    body: JSON.stringify(curso), // Convertimos los campos modificados a cadena JSON
});

const actualizarCurso = (id, curso) => solicitar(`/cursos/${id}`, {
    method: "PUT",
    body: JSON.stringify(curso), // Convertimos los campos modificados a cadena JSON
});

const eliminarCurso = (id) => solicitar(`/cursos/${id}`, { method: "DELETE" });

const obtenerFacilitadores = () => solicitar("/facilitadores");
