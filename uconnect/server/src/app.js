// file for setting up the express app, etc.
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const eventsRoutes = require("./routes/events");
const db = require("./db/db");

const app = express();
const port = 8000;

app.use(bodyParser.json());

const corsOptions = {
	origin: [
		"http://localhost:3000",
		"https://u-connect-frontend.vercel.app/",
		"https://u-connect-server.vercel.app/",
	],
};

app.use(cors(corsOptions));

// adding a route for the root URL
// displays a message to the backend deployment (mainly used for debugging)
app.get("/", (req, res) => {
	res.send("Welcome to the U-Connect Server!");
});

app.use(eventsRoutes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
