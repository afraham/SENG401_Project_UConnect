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
router.get("/api/joinedEventsByEmail", eventsController.getMyJoinedEventsByEmail);
router.put("/api/eventById/:eventId", eventsController.addCommentToEvent);
router.delete("/api/events/:eventId", eventsController.deleteEvent);
router.put("/api/events/approve/:eventId", eventsController.approveUser);
router.put("/api/events/deny/:eventId", eventsController.denyUser);
router.put("/api/events/leave/:eventId", eventsController.userLeftEvent);
router.delete("/api/events/delete/:eventId", eventsController.deleteEvent);
router.patch("/api/events/:eventId/edit", eventsController.updateEvent);
router.put("/api/events/cancelPending/:eventId", eventsController.cancelPending);
router.put("/api/events/kick/:eventId", eventsController.kickUser);



module.exports = router;
