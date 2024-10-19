const express = require("express");
const router = express.Router();
const { updateBanner, getAllBanners } = require("../controllers/BannersController");

router.put("/banners/:id", updateBanner); // Ruta para actualizar un banner
router.get("/banners", getAllBanners);

module.exports = router;
