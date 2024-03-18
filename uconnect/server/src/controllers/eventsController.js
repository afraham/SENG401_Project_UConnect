const db = require("../db/db");

exports.createEvent = async (req, res) => {
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const eventData = req.body;

		const result = await collection.insertOne(eventData);

		console.log(`Successfully inserted event with _id: ${result.insertedId}`);
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(201).send({ message: "Event created successfully" });
	} catch (error) {
		console.error("Error inserting event:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

exports.getEvents = async (req, res) => {
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const events = await collection.find().toArray();

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(200).json(events);
	} catch (error) {
		console.error("Error retrieving events:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};
