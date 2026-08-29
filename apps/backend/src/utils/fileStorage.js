// módulos nativos de node.js para el manejo de archivos de forma asíncrona
const fs = require("fs/promises");
const path = require("path");

const leerJson = async (filePath, defaultValue = []) => {
  try {
    const contenido = await fs.readFile(filePath, "utf8"); //leer el contenido del archivo en formato de texto utf8
    return JSON.parse(contenido);  // Convertimos la cadena JSON a un objeto/arreglo JS y lo devolvemos
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error(`No se pudo leer ${path.basename(filePath)}`);
    }
    // Si el archivo no existe (ENOENT), lo creamos dinámicamente con el valor por defecto y lo devolvemos
    await escribirJson(filePath, defaultValue);
    return defaultValue;
  }
};

const escribirJson = async (filePath, data) => {
  // asegura que la carpeta contenedora exista; si no existe, la crea de forma recursiva 
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  // Guarda los datos formateados con 2 espacios de sangría y un salto de línea al final
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8"); 
};

module.exports = { leerJson, escribirJson };
 