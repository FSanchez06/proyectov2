const cloudinary = require("cloudinary").v2;

module.exports = {

  updateImage: (req, res) => {
    const imageId = req.params.id;
    const userId = req.body.ID_Usuario;
    const newImageHome = req.files?.ImageHome;

    req.getConnection((err, conn) => {
      if (err) return res.status(500).send("Error de conexión a la base de datos.");

      conn.query("SELECT PublicId FROM Images WHERE ID_Image = ?", [imageId], (err, rows) => {
        if (err) return res.status(500).send("Error al obtener la imagen.");
        if (rows.length === 0) return res.status(404).send("Imagen no encontrada.");

        const oldPublicId = rows[0].PublicId;

        // Elimina la imagen antigua de Cloudinary
        cloudinary.uploader.destroy(oldPublicId, (err) => {
          if (err) return res.status(500).send("Error al eliminar la imagen anterior de Cloudinary.");

          if (newImageHome) {
            cloudinary.uploader.upload(newImageHome.tempFilePath, (err, result) => {
              if (err) return res.status(500).send("Error al subir la nueva imagen a Cloudinary.");

              const updatedImage = {
                ImageHome: result.secure_url,
                PublicId: result.public_id,
                ID_Usuario: userId
              };

              conn.query("UPDATE Images SET ? WHERE ID_Image = ?", [updatedImage, imageId], (err) => {
                if (err) return res.status(500).send("Error al actualizar la imagen.");
                res.send("Imagen actualizada correctamente.");
              });
            });
          }
        });
      });
    });
  },

  getAllImages: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send("Error de conexión a la base de datos.");
      
      conn.query("SELECT * FROM Images", (err, rows) => {
        if (err) return res.status(500).send("Error al obtener las imágenes.");
        res.json(rows);
      });
    });
  }

};
