const express = require("express");
const router = express.Router();
const { getAllMensajes, getMensajeById, createMensaje, deleteMensaje } = require("../controllers/MensajeController");

router.get("/mensajes", getAllMensajes);
router.get("/mensajes/:id", getMensajeById); // Nueva ruta para obtener mensaje por ID
router.post("/mensajes", createMensaje);
router.delete("/mensajes/:id", deleteMensaje);

module.exports = router;
