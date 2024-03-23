// routes/profile.js

const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profilesController");

// Route to fetch all new profile
router.post("/api/profiles", profilesController.createProfile);

module.exports = router;



