// file to handle the routing for events
const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/eventsController");

router.post("/api/events", eventsController.createEvent);
router.get("/api/events", eventsController.getEvents);

module.exports = router;
