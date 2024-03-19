// file to handle the routing for events
const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/eventsController");
const { getEventsByEmail } = require("../controllers/eventsController");

router.post("/api/events", eventsController.createEvent);
router.get("/api/events", eventsController.getEvents);
router.get("/api/eventsByEmail", getEventsByEmail);

module.exports = router;
