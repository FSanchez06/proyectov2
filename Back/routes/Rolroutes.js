const express = require("express");
const router = express.Router();
const { getAllRoles} = require("../controllers/RolController");

router.get("/roles", getAllRoles);

module.exports = router;
