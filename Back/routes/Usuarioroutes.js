const express = require("express");
const router = express.Router();
const { updateProfilePic, getAllUsuarios, getUsuarioById, createUsuario, deleteUsuario, updateUsuario, loginUsuario } = require("../controllers/UsuarioController");

// Rutas
router.put("/updateProfilePic/:id", updateProfilePic);  // Para actualizar solo la foto de perfil
router.get("/usuarios", getAllUsuarios);
router.get("/usuarios/:id", getUsuarioById);
router.post("/usuarios", createUsuario);
router.delete("/usuarios/:id", deleteUsuario);
router.put("/usuarios/:id", updateUsuario);  // Para actualizar los datos del usuario (sin la foto de perfil)
router.post("/usuarios/login", loginUsuario);

module.exports = router;
