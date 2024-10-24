const express = require("express");
const router = express.Router();
const { updateProfilePic, getAllUsuarios, getUsuarioById, createUsuario, deleteUsuario, updateUsuario, loginUsuario } = require("../controllers/UsuarioController");

// Rutas
router.put("/updateProfilePic/:id", updateProfilePic);
router.get("/usuarios", getAllUsuarios);
router.get("/usuarios/:id", getUsuarioById);
router.post("/usuarios", createUsuario);
router.delete("/usuarios/:id", deleteUsuario);
router.put("/usuarios/:id", updateUsuario);
router.post("/usuarios/login", loginUsuario);

module.exports = router;
