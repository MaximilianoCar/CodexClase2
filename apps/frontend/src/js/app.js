// Seleccionamos los elementos y contenedores del DOM que vamos a usar

const cursoForm = document.querySelector("#curso-form");
const nombreInput = document.querySelector("#nombre");
const descripcionInput = document.querySelector("#descripcion");
const submitButton = document.querySelector("#submit-btn");
const cancelButton = document.querySelector("#cancel-btn");
const listaCursos = document.querySelector("#lista-cursos");
const listaFacilitadores = document.querySelector("#lista-facilitadores");
const estadoCursos = document.querySelector("#estado-cursos");
const estadoFacilitadores = document.querySelector("#estado-facilitadores");
let cursoEnEdicion = null;

const mostrarError = (estado, error) => {
    estado.textContent = error.message;
    estado.classList.add("error");
};

const renderizarCursos = (cursos) => { //// Limpia y construye dinámicamente la lista de cursos en el DOM a partir de un arreglo (obtenido de la API)
    listaCursos.replaceChildren();
    estadoCursos.textContent = cursos.length ? "Cursos disponibles" : "No hay cursos registrados";
    estadoCursos.classList.remove("error");

    cursos.forEach((curso) => {
        const item = document.createElement("li"); //elemento li para cada curso
        item.className = "curso item";

        const info = document.createElement("div");
        info.className = "item-info";

        const nombre = document.createElement("strong");
        nombre.textContent = curso.titulo;

        const descripcion = document.createElement("span");
        descripcion.textContent = curso.descripcion;
        
        info.append(nombre, descripcion);

        const acciones = document.createElement("div"); //div para las acciones de editar y eliminar
        acciones.className = "item-actions";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.textContent = "Editar";
        editar.addEventListener("click", () => iniciarEdicion(curso));

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "danger";
        eliminar.textContent = "Eliminar";
        eliminar.addEventListener("click", () => borrarCurso(curso.id));

        acciones.append(editar, eliminar);
        item.append(info, acciones);
        listaCursos.appendChild(item);
    });
};

const cargarCursos = async () => {
    try {
        renderizarCursos(await obtenerCursos());
    } catch (error) {
        mostrarError(estadoCursos, error);
    }
};

const renderizarFacilitadores = (facilitadores) => {
    listaFacilitadores.replaceChildren();
    estadoFacilitadores.textContent = facilitadores.length
        ? "Facilitadores disponibles"
        : "No hay facilitadores registrados";
    estadoFacilitadores.classList.remove("error");

    facilitadores.forEach((facilitador) => {
        const item = document.createElement("li");
        item.className = "facilitador item";

        const info = document.createElement("div");
        info.className = "item-info";

        const nombre = document.createElement("strong");
        nombre.textContent = facilitador.nombre;

        const especialidad = document.createElement("span");
        especialidad.textContent = facilitador.especialidad;

        info.append(nombre, especialidad);
        item.appendChild(info);
        listaFacilitadores.appendChild(item);
    });
};

const cargarFacilitadores = async () => {
    try {
        renderizarFacilitadores(await obtenerFacilitadores());
    } catch (error) {
        mostrarError(estadoFacilitadores, error);
    }
};

const iniciarEdicion = (curso) => {
    cursoEnEdicion = curso.id;
    nombreInput.value = curso.titulo;
    descripcionInput.value = curso.descripcion;
    submitButton.textContent = "Guardar cambios";
    cancelButton.classList.remove("hidden");
    nombreInput.focus();
};

const cancelarEdicion = () => {
    cursoEnEdicion = null;
    cursoForm.reset();
    submitButton.textContent = "Crear curso";
    cancelButton.classList.add("hidden");
};

const borrarCurso = async (id) => {
    if (!window.confirm("¿Deseas eliminar este curso?")) return;

    try {
        await eliminarCurso(id);
        if (cursoEnEdicion === id) cancelarEdicion();
        await cargarCursos();
    } catch (error) {
        mostrarError(estadoCursos, error);
    }
};

cursoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const curso = {
        nombre: nombreInput.value.trim(),
        descripcion: descripcionInput.value.trim(),
    };

    if (!curso.nombre || !curso.descripcion) {
        estadoCursos.textContent = "Nombre y descripcion son obligatorios";
        estadoCursos.classList.add("error");
        return;
    }

    try {
        if (cursoEnEdicion) { // Si estamos editando un curso existente, usamos su ID para actualizarlo
            await actualizarCurso(cursoEnEdicion, curso);
        } else { // si no estamos editando, creamos un nuevo curso
            await crearCurso(curso);
        }
        cancelarEdicion();
        await cargarCursos();
    } catch (error) {
        mostrarError(estadoCursos, error);
    }
});

cancelButton.addEventListener("click", cancelarEdicion);
cargarCursos(); // Carga inicial de cursos al abrir la página
cargarFacilitadores(); // Carga inicial de facilitadores al abrir la página
