const cloudinary = require("cloudinary").v2;

module.exports = {
    updateProfilePic: (req, res) => {
        const userId = req.params.id;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No se ha subido ningún archivo.");
        }

        const profilePic = req.files.FotoPerfil;

        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            const query = "SELECT PublicId, FotoPerfil FROM Usuario WHERE ID_Usuario = ?";
            conn.query(query, [userId], (err, rows) => {
                if (err) return res.status(500).send("Error al obtener el usuario");
                if (rows.length === 0) return res.status(404).send("Usuario no encontrado");

                const oldPublicId = rows[0].PublicId;
                
                if (oldPublicId) {
                    cloudinary.uploader.destroy(oldPublicId, (err) => {
                        if (err) return res.status(500).send("Error al eliminar la imagen anterior");

                        cloudinary.uploader.upload(profilePic.tempFilePath, (err, result) => {
                            if (err) return res.status(500).send("Error al subir a Cloudinary");

                            const newProfilePicUrl = result.secure_url;
                            const newPublicId = result.public_id;

                            const updateQuery = "UPDATE Usuario SET FotoPerfil = ?, PublicId = ? WHERE ID_Usuario = ?";
                            conn.query(updateQuery, [newProfilePicUrl, newPublicId, userId], (err) => {
                                if (err) return res.status(500).send("Error al actualizar la foto de perfil");

                                res.send("Foto de perfil actualizada correctamente");
                            });
                        });
                    });
                } else {
                    cloudinary.uploader.upload(profilePic.tempFilePath, (err, result) => {
                        if (err) return res.status(500).send("Error al subir a Cloudinary");

                        const newProfilePicUrl = result.secure_url;
                        const newPublicId = result.public_id;

                        const updateQuery = "UPDATE Usuario SET FotoPerfil = ?, PublicId = ? WHERE ID_Usuario = ?";
                        conn.query(updateQuery, [newProfilePicUrl, newPublicId, userId], (err) => {
                            if (err) return res.status(500).send("Error al actualizar la foto de perfil");

                            res.send("Foto de perfil actualizada correctamente");
                        });
                    });
                }
            });
        });
    },

    getAllUsuarios: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            conn.query("SELECT * FROM Usuario", (err, rows) => {
                if (err) return res.status(500).send("Error al obtener los usuarios");

                res.json(rows);
            });
        });
    },

    getUsuarioById: (req, res) => {
        const userId = req.params.id;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            conn.query("SELECT * FROM Usuario WHERE ID_Usuario = ?", [userId], (err, row) => {
                if (err) return res.status(500).send("Error al obtener el usuario");
                if (row.length === 0) return res.status(404).send("Usuario no encontrado");

                res.json(row[0]);
            });
        });
    },

    createUsuario: (req, res) => {
        const newUser = req.body;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            conn.query("INSERT INTO Usuario SET ?", [newUser], (err, result) => {
                if (err) return res.status(500).send("Error al crear el usuario");

                res.status(201).send("Usuario creado correctamente");
            });
        });
    },

    deleteUsuario: (req, res) => {
        const userId = req.params.id;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            conn.query("DELETE FROM Usuario WHERE ID_Usuario = ?", [userId], (err, result) => {
                if (err) return res.status(500).send("Error al eliminar el usuario");

                res.send("Usuario eliminado correctamente");
            });
        });
    },

    updateUsuario: (req, res) => {
        const userId = req.params.id;
        const updatedUser = req.body;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            conn.query("UPDATE Usuario SET ? WHERE ID_Usuario = ?", [updatedUser, userId], (err, result) => {
                if (err) return res.status(500).send("Error al actualizar el usuario");

                res.send("Usuario actualizado correctamente");
            });
        });
    }
};
