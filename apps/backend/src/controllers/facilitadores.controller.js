const path = require("path");
const { leerJson } = require("../utils/fileStorage");

const facilitadoresPath = path.join(__dirname, "../data/facilitadores.json");

// GET /api/facilitadores
const obtenerFacilitadores = async (req, res) => {
    try {
        res.json(await leerJson(facilitadoresPath));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { obtenerFacilitadores };
