// file for setting up the express app, etc.
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const eventsRoutes = require("./src/routes/events");
const profileRoutes = require("./src/routes/profiles"); // Import profiles routes
const db = require("./src/db/db");

const app = express();
const port = 8000;

app.use(bodyParser.json());

const corsOptions = {
	origin: "*",
	credentials: true,
	methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
	exposedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
};

app.use(cors(corsOptions));

// adding a route for the root URL
// displays a message to the backend deployment (mainly used for debugging)
app.get("/", (req, res) => {
	res.status(200).json({ message: "Hello from the backend!" });
});

// Adding events routes
app.use(eventsRoutes);

// Adding profiles routes
app.use(profileRoutes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
