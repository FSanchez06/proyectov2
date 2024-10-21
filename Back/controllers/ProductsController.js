const cloudinary = require("cloudinary").v2;

module.exports = {
    // Crear un nuevo producto
    createProducto: (req, res) => {
        const { NombreProducto, PrecioProducto, Color, Insignia, Descripcion, ID_Usuario } = req.body;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No se ha subido ningún archivo.");
        }

        const ImgProducto = req.files.ImgProducto;

        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            cloudinary.uploader.upload(ImgProducto.tempFilePath, (err, result) => {
                if (err) return res.status(500).send("Error al subir imagen a Cloudinary");

                const newProducto = {
                    ImgProducto: result.secure_url,
                    PublicId: result.public_id,
                    NombreProducto,
                    PrecioProducto,
                    Color,
                    Insignia,
                    Descripcion,
                    ID_Usuario
                };

                const query = "INSERT INTO Productos SET ?";
                conn.query(query, [newProducto], (err) => {
                    if (err) return res.status(500).send("Error al crear el producto");

                    res.status(201).send("Producto creado correctamente");
                });
            });
        });
    },

    // Obtener todos los productos
    getAllProductos: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            const query = "SELECT * FROM Productos";
            conn.query(query, (err, rows) => {
                if (err) return res.status(500).send("Error al obtener los productos");

                res.json(rows);
            });
        });
    },

    // Obtener producto por ID
    getProductoById: (req, res) => {
        const productoId = req.params.id;

        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            const query = "SELECT * FROM Productos WHERE ID_Producto = ?";
            conn.query(query, [productoId], (err, row) => {
                if (err) return res.status(500).send("Error al obtener el producto");
                if (row.length === 0) return res.status(404).send("Producto no encontrado");

                res.json(row[0]);
            });
        });
    },

    // Actualizar un producto (incluyendo imagen)
    updateProducto: (req, res) => {
        const productoId = req.params.id;
        const { NombreProducto, PrecioProducto, Color, Insignia, Descripcion, ID_Usuario } = req.body;

        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            // Primero obtener el producto y su PublicId actual
            const getQuery = "SELECT PublicId FROM Productos WHERE ID_Producto = ?";
            conn.query(getQuery, [productoId], (err, rows) => {
                if (err) return res.status(500).send("Error al obtener el producto");
                if (rows.length === 0) return res.status(404).send("Producto no encontrado");

                const publicIdActual = rows[0].PublicId;

                // Si hay un archivo nuevo para subir (imagen)
                if (req.files && req.files.ImgProducto) {
                    const nuevaImgProducto = req.files.ImgProducto;

                    // Subir nueva imagen a Cloudinary
                    cloudinary.uploader.upload(nuevaImgProducto.tempFilePath, (err, result) => {
                        if (err) return res.status(500).send("Error al subir la nueva imagen a Cloudinary");

                        const updatedProducto = {
                            ImgProducto: result.secure_url,
                            PublicId: result.public_id,
                            NombreProducto,
                            PrecioProducto,
                            Color,
                            Insignia,
                            Descripcion,
                            ID_Usuario
                        };

                        const updateQuery = "UPDATE Productos SET ? WHERE ID_Producto = ?";
                        conn.query(updateQuery, [updatedProducto, productoId], (err) => {
                            if (err) return res.status(500).send("Error al actualizar el producto");

                            // Eliminar la imagen anterior de Cloudinary
                            cloudinary.uploader.destroy(publicIdActual, (err) => {
                                if (err) return res.status(500).send("Error al eliminar la imagen anterior en Cloudinary");

                                res.send("Producto actualizado correctamente y la imagen anterior eliminada");
                            });
                        });
                    });
                } else {
                    // Si no hay nueva imagen, solo actualizar los datos del producto
                    const updatedProducto = { NombreProducto, PrecioProducto, Color, Insignia, Descripcion, ID_Usuario };

                    const updateQuery = "UPDATE Productos SET ? WHERE ID_Producto = ?";
                    conn.query(updateQuery, [updatedProducto, productoId], (err) => {
                        if (err) return res.status(500).send("Error al actualizar el producto");

                        res.send("Producto actualizado correctamente sin cambiar la imagen");
                    });
                }
            });
        });
    },

    // Eliminar un producto
    deleteProducto: (req, res) => {
        const productoId = req.params.id;

        req.getConnection((err, conn) => {
            if (err) return res.status(500).send("Error de conexión a la base de datos");

            const query = "SELECT PublicId FROM Productos WHERE ID_Producto = ?";
            conn.query(query, [productoId], (err, rows) => {
                if (err) return res.status(500).send("Error al obtener el producto");

                const publicId = rows[0].PublicId;

                cloudinary.uploader.destroy(publicId, (err) => {
                    if (err) return res.status(500).send("Error al eliminar la imagen en Cloudinary");

                    const deleteQuery = "DELETE FROM Productos WHERE ID_Producto = ?";
                    conn.query(deleteQuery, [productoId], (err) => {
                        if (err) return res.status(500).send("Error al eliminar el producto");

                        res.send("Producto eliminado correctamente");
                    });
                });
            });
        });
    }
};
