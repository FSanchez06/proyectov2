const express = require("express");
const router = express.Router();
const { updateImage, getAllImages } = require("../controllers/ImagesController");

router.put("/images/:id", updateImage);
router.get("/images", getAllImages);

module.exports = router;
