// 1 GESTION DE CURSOS

// seleccionar de elementos del DOM
const cursoForm = document.querySelector("#curso-form");
const nombreInput = document.querySelector("#nombre");
const descripcionInput = document.querySelector("#descripcion");
const listaCursos = document.querySelector("#lista");

// evento submit del form
cursoForm.addEventListener("submit", (event) => {
    event.preventDefault(); // evita que la página se recargue

    // obtener y limpiar los valores de los inputs
    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (!nombre || !descripcion) return;

    // Nuevo elemento li
    const nuevoCursoLi = document.createElement("li");
    nuevoCursoLi.className = "curso item";

    nuevoCursoLi.innerHTML = `
        <div class="item-info">
            <strong>${nombre}</strong>
            <span>${descripcion}</span>
        </div>
    `;

    // Agregar el nuevo elemento a la lista en el DOM
    listaCursos.appendChild(nuevoCursoLi);

    // Limpiar el formulario
    cursoForm.reset();
    nombreInput.focus();
});

// 2 EJEMPLO CONSUMO API CON FETCH

// seleccionar el botón de buscar facilitadores
const btnBuscarFacilitadores = document.querySelector(".item-actions button");

const API_URL = "https://randomuser.me/api/?results=5&nat=es"; //ulrl de la api

const obtenerFacilitadores = async () => {
    // lista
    const listados = document.querySelectorAll(".lista");
    const listaFacilitadores = listados[1] || listados[0];

    try {
        const respuesta = await fetch(API_URL); //await para esperar la respuesta de la API
        const datos = await respuesta.json(); //await para esperar la respuesta en formato JSON

        // .map() para transformar los objetos y unir nombre + apellido
        const facilitadores = datos.results.map((usuario) => {
            return {
                nombreCompleto: `${usuario.name.first} ${usuario.name.last}`,
                rol: "Facilitador",
            };
        });

        // Limpiar contenedor antes de insertar los 5 resultados
        listaFacilitadores.innerHTML = "";

        // renderizar cada facilitador procesado
        facilitadores.forEach((facilitador) => {
            const li = document.createElement("li");
            li.className = "facilitador item";
            li.innerHTML = `
                <div class="item-info">
                    <strong>${facilitador.nombreCompleto}</strong>
                    <span>${facilitador.rol}</span>
                </div>
            `;
            listaFacilitadores.appendChild(li);
        });
    } catch (error) {
        console.error("Error al consultar la API:", error);
        listaFacilitadores.innerHTML = `
            <li class="item">
                <span style="color: red;">Error al cargar los facilitadores.</span>
            </li>
        `;
    }
};

// evento al boton de búsqueda
if (btnBuscarFacilitadores) {
    btnBuscarFacilitadores.addEventListener("click", obtenerFacilitadores);
}
