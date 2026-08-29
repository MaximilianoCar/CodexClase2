const express = require("express");
const router = express.Router();
const facilitadoresController = require("../controllers/facilitadores.controller");

router.get("/", facilitadoresController.obtenerFacilitadores);

module.exports = router;
