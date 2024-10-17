const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware para manejar archivos
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// Ruta para actualizar solo la foto de perfil
router.put("/updateProfilePic/:id", (req, res) => {
    const userId = req.params.id;

    // Verificar si se ha subido un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No se ha subido ningún archivo.");
    }

    const profilePic = req.files.FotoPerfil;

    // Primero, obtener el public_id de la imagen anterior
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send("Error de conexión a la base de datos");

        const query = "SELECT PublicId, FotoPerfil FROM Usuario WHERE ID_Usuario = ?";
        conn.query(query, [userId], (err, rows) => {
            if (err) return res.status(500).send("Error al obtener el usuario");
            if (rows.length === 0) return res.status(404).send("Usuario no encontrado");

            const oldPublicId = rows[0].PublicId; // Guardamos el public_id anterior
            const oldPhotoUrl = rows[0].FotoPerfil; // Guardamos la URL anterior

            // Si hay una imagen anterior, la eliminamos
            if (oldPublicId) {
                cloudinary.uploader.destroy(oldPublicId, (err) => {
                    if (err) {
                        console.error("Error al eliminar la imagen anterior en Cloudinary:", err);
                        return res.status(500).send("Error al eliminar la imagen anterior en Cloudinary");
                    }

                    // Subir la nueva imagen a Cloudinary
                    cloudinary.uploader.upload(profilePic.tempFilePath, (err, result) => {
                        if (err) {
                            console.error("Error al subir a Cloudinary:", err);
                            return res.status(500).send("Error al subir a Cloudinary: " + err.message);
                        }

                        const newProfilePicUrl = result.secure_url;
                        const newPublicId = result.public_id; // Obtenemos el nuevo public_id

                        // Actualizar la URL de la nueva imagen y el public_id en la base de datos
                        const updateQuery = "UPDATE Usuario SET FotoPerfil = ?, PublicId = ? WHERE ID_Usuario = ?";
                        conn.query(updateQuery, [newProfilePicUrl, newPublicId, userId], (err) => {
                            if (err) return res.status(500).send("Error al actualizar la foto de perfil en la base de datos");

                            res.send("Foto de perfil actualizada correctamente");
                        });
                    });
                });
            } else {
                // Si no hay imagen anterior, simplemente subimos la nueva
                cloudinary.uploader.upload(profilePic.tempFilePath, (err, result) => {
                    if (err) {
                        console.error("Error al subir a Cloudinary:", err);
                        return res.status(500).send("Error al subir a Cloudinary: " + err.message);
                    }

                    const newProfilePicUrl = result.secure_url;
                    const newPublicId = result.public_id; // Obtenemos el nuevo public_id

                    // Actualizar la URL de la nueva imagen y el public_id en la base de datos
                    const updateQuery = "UPDATE Usuario SET FotoPerfil = ?, PublicId = ? WHERE ID_Usuario = ?";
                    conn.query(updateQuery, [newProfilePicUrl, newPublicId, userId], (err) => {
                        if (err) return res.status(500).send("Error al actualizar la foto de perfil en la base de datos");

                        res.send("Foto de perfil actualizada correctamente");
                    });
                });
            }
        });
    });
});

// Otras rutas para manejar operaciones CRUD de los usuarios

// Ruta para obtener todos los usuarios
router.get("/usuarios", (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send("Error de conexión a la base de datos");

        conn.query("SELECT * FROM Usuario", (err, rows) => {
            if (err) return res.status(500).send("Error al obtener los usuarios");

            res.json(rows);
        });
    });
});

// Ruta para obtener un usuario por su ID
router.get("/usuarios/:id", (req, res) => {
    const userId = req.params.id;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send("Error de conexión a la base de datos");

        conn.query("SELECT * FROM Usuario WHERE ID_Usuario = ?", [userId], (err, row) => {
            if (err) return res.status(500).send("Error al obtener el usuario");
            if (row.length === 0) return res.status(404).send("Usuario no encontrado");

            res.json(row[0]);
        });
    });
});

// Ruta para crear un nuevo usuario
router.post("/usuarios", (req, res) => {
    const newUser = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send("Error de conexión a la base de datos");

        conn.query("INSERT INTO Usuario SET ?", [newUser], (err, result) => {
            if (err) return res.status(500).send("Error al crear el usuario");

            res.status(201).send("Usuario creado correctamente");
        });
    });
});

// Ruta para eliminar un usuario por ID
router.delete("/usuarios/:id", (req, res) => {
    const userId = req.params.id;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send("Error de conexión a la base de datos");

        conn.query("DELETE FROM Usuario WHERE ID_Usuario = ?", [userId], (err, result) => {
            if (err) return res.status(500).send("Error al eliminar el usuario");

            res.send("Usuario eliminado correctamente");
        });
    });
});

// Ruta para actualizar un usuario
router.put("/usuarios/:id", (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send("Error de conexión a la base de datos");

        conn.query("UPDATE Usuario SET ? WHERE ID_Usuario = ?", [updatedUser, userId], (err, result) => {
            if (err) return res.status(500).send("Error al actualizar el usuario");

            res.send("Usuario actualizado correctamente");
        });
    });
});

module.exports = router;
