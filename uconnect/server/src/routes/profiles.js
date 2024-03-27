// routes/profile.js

const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profilesController");

// Route to update an existing profile
router.put("/api/profiles/update", profilesController.updateProfile);
router.get("/api/profiles/:email", profilesController.fetchProfileInfo);

// Route to update an existing profile
router.put("/api/profiles/update", profilesController.updateProfile);
router.get("/api/profiles/:email", profilesController.fetchProfileInfo);

module.exports = router;
