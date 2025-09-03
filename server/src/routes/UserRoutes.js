const express = require("express");
const { getUserProfile } = require("../controller/UserController");

const router = express.Router();

// Fetch a user profile by ID
router.get("/:id", getUserProfile);

module.exports = router;
