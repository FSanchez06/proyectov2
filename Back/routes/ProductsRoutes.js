const express = require("express");
const router = express.Router();
const { createProducto, getAllProductos, getProductoById, updateProducto, deleteProducto } = require("../controllers/ProductsController");

// Rutas para productos
router.post("/productos", createProducto);
router.get("/productos", getAllProductos);
router.get("/productos/:id", getProductoById);
router.put("/productos/:id", updateProducto);
router.delete("/productos/:id", deleteProducto);

module.exports = router;
