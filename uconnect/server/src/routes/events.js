// file to handle the routing for events
const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/eventsController");
const { getEventsByEmail } = require("../controllers/eventsController");

router.post("/api/events", eventsController.createEvent);
router.get("/api/events", eventsController.getEvents);
router.put("/api/events/:eventId/join", eventsController.requestToJoinEvent)
router.get("/api/eventsByEmail", getEventsByEmail);
router.get("/api/pendingEventsByEmail", eventsController.getMyPendingEventsByEmail);
router.delete("/api/events/:eventId", eventsController.deleteEvent); // Add this line for delete

module.exports = router;
