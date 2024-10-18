const express = require("express");
const router = express.Router();
const { createBanner, updateBanner, getAllBanners, deleteBanner } = require("../controllers/BannersController");

router.post("/banners", createBanner);
router.put("/banners/:id", updateBanner); // Ruta para actualizar un banner
router.get("/banners", getAllBanners);
router.delete("/banners/:id", deleteBanner);

module.exports = router;
