// routes/authRoutes.js
const express = require("express");
const { login } = require("./../controller/AuthController");

const router = express.Router();

// Login route
router.post("/login", login);

module.exports = router;
