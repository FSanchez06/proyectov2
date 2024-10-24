const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcryptjs");

module.exports = {
    updateProfilePic: async (req, res) => {
        const userId = req.params.id;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No se ha subido ningún archivo.");
        }

        const profilePic = req.files.FotoPerfil;

        try {
            req.getConnection(async (err, conn) => {
                if (err) return res.status(500).send("Error de conexión a la base de datos");

                const query = "SELECT PublicId, FotoPerfil FROM Usuario WHERE ID_Usuario = ?";
                const [rows] = await conn.query(query, [userId]);
                if (rows.length === 0) return res.status(404).send("Usuario no encontrado");

                const oldPublicId = rows[0].PublicId;

                // Eliminar la imagen anterior si existe
                if (oldPublicId) {
                    await cloudinary.uploader.destroy(oldPublicId);
                }

                // Subir la nueva imagen
                const result = await cloudinary.uploader.upload(profilePic.tempFilePath);
                const newProfilePicUrl = result.secure_url;
                const newPublicId = result.public_id;

                const updateQuery = "UPDATE Usuario SET FotoPerfil = ?, PublicId = ? WHERE ID_Usuario = ?";
                await conn.query(updateQuery, [newProfilePicUrl, newPublicId, userId]);

                res.send("Foto de perfil actualizada correctamente");
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al procesar la solicitud");
        }
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

            conn.query("INSERT INTO Usuario SET ?", [newUser], (err) => {
                if (err) return res.status(500).send("Error al crear el usuario");

                res.status(201).send("Usuario creado correctamente");
            });
        });
    },

    deleteUsuario: (req, res) => {
        const userId = req.params.id;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            conn.query("DELETE FROM Usuario WHERE ID_Usuario = ?", [userId], (err) => {
                if (err) return res.status(500).send("Error al eliminar el usuario");

                res.send("Usuario eliminado correctamente");
            });
        });
    },

    loginUsuario: (req, res) => {
        const { email, password } = req.body;

        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            const query = "SELECT * FROM Usuario WHERE Email = ?";
            conn.query(query, [email], (err, rows) => {
                if (err) return res.status(500).send("Error al obtener el usuario");
                if (rows.length === 0) return res.status(404).send("Usuario no encontrado");

                const user = rows[0];

                // Comparar la contraseña
                bcrypt.compare(password, user.Contraseña, (err, isMatch) => {
                    if (err) return res.status(500).send("Error al comparar contraseñas");
                    if (!isMatch) return res.status(401).send("Contraseña incorrecta");

                    // Si las credenciales son válidas, enviar la información del usuario
                    res.json({ id: user.ID_Usuario, email: user.Email, ...user });
                });
            });
        });
    },

    updateUsuario: (req, res) => {
        const userId = req.params.id;
        const updatedUser = req.body;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            conn.query("UPDATE Usuario SET ? WHERE ID_Usuario = ?", [updatedUser, userId], (err) => {
                if (err) return res.status(500).send("Error al actualizar el usuario");

                res.send("Usuario actualizado correctamente");
            });
        });
    }
};
