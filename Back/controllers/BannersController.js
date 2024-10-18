const cloudinary = require("cloudinary").v2;

module.exports = {
    createBanner: (req, res) => {
        const userId = req.body.ID_Usuario; // Asegúrate de que el ID del usuario sea parte del cuerpo de la solicitud
        const bannerImg = req.files.ImgBanner;

        if (!bannerImg) {
            return res.status(400).send("No se ha subido ninguna imagen para el banner.");
        }

        cloudinary.uploader.upload(bannerImg.tempFilePath, (err, result) => {
            if (err) return res.status(500).send("Error al subir la imagen a Cloudinary.");

            const newBanner = {
                ImgBanner: result.secure_url,
                PublicId: result.public_id,
                ID_Usuario: userId
            };

            req.getConnection((err, conn) => {
                if (err) return res.status(500).send("Error de conexión a la base de datos.");

                conn.query("INSERT INTO Banners SET ?", [newBanner], (err) => {
                    if (err) return res.status(500).send("Error al crear el banner.");
                    res.status(201).send("Banner creado correctamente.");
                });
            });
        });
    },

    updateBanner: (req, res) => {
        const bannerId = req.params.id;
        const userId = req.body.ID_Usuario; // ID del usuario que actualiza el banner
        const bannerImg = req.files?.ImgBanner; // Imagen nueva para el banner

        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos.");

            conn.query("SELECT PublicId FROM Banners WHERE ID_Banner = ?", [bannerId], (err, rows) => {
                if (err) return res.status(500).send("Error al obtener el banner.");
                if (rows.length === 0) return res.status(404).send("Banner no encontrado.");

                const oldPublicId = rows[0].PublicId;

                // Eliminar la imagen antigua de Cloudinary
                cloudinary.uploader.destroy(oldPublicId, (err) => {
                    if (err) return res.status(500).send("Error al eliminar la imagen antigua de Cloudinary.");

                    if (bannerImg) {
                        cloudinary.uploader.upload(bannerImg.tempFilePath, (err, result) => {
                            if (err) return res.status(500).send("Error al subir la nueva imagen a Cloudinary.");

                            const updatedBanner = {
                                ImgBanner: result.secure_url,
                                PublicId: result.public_id,
                                ID_Usuario: userId
                            };

                            conn.query("UPDATE Banners SET ? WHERE ID_Banner = ?", [updatedBanner, bannerId], (err) => {
                                if (err) return res.status(500).send("Error al actualizar el banner.");
                                res.send("Banner actualizado correctamente.");
                            });
                        });
                    } else {
                        // Si no hay nueva imagen, solo actualiza el ID_Usuario
                        conn.query("UPDATE Banners SET ID_Usuario = ? WHERE ID_Banner = ?", [userId, bannerId], (err) => {
                            if (err) return res.status(500).send("Error al actualizar el banner.");
                            res.send("Banner actualizado correctamente (sin nueva imagen).");
                        });
                    }
                });
            });
        });
    },

    getAllBanners: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos.");

            conn.query("SELECT * FROM Banners", (err, rows) => {
                if (err) return res.status(500).send("Error al obtener los banners.");
                res.json(rows);
            });
        });
    },

    deleteBanner: (req, res) => {
        const bannerId = req.params.id;
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos.");

            const query = "SELECT PublicId FROM Banners WHERE ID_Banner = ?";
            conn.query(query, [bannerId], (err, rows) => {
                if (err) return res.status(500).send("Error al obtener el banner.");
                if (rows.length === 0) return res.status(404).send("Banner no encontrado.");

                const publicId = rows[0].PublicId;
                cloudinary.uploader.destroy(publicId, (err) => {
                    if (err) return res.status(500).send("Error al eliminar la imagen de Cloudinary.");

                    conn.query("DELETE FROM Banners WHERE ID_Banner = ?", [bannerId], (err) => {
                        if (err) return res.status(500).send("Error al eliminar el banner.");
                        res.send("Banner eliminado correctamente.");
                    });
                });
            });
        });
    },
};
