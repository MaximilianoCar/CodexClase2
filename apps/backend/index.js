const app = require("./src/app");
require('dotenv').config();
const { connectDB } = require("./src/config/db");
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // verificar BD antes de levantar el servidor
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error crítico al iniciar la aplicación:', error.message);
    process.exit(1);
  }
}

main();

