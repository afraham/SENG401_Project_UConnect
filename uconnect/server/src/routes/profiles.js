// routes/profile.js

const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profilesController");

// Route to update an existing profile
router.put("/api/profiles", profilesController.updateProfile);

module.exports = router;



