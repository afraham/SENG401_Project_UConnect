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

		const userEmail = req.query.userEmail;
		let events;

		if (userEmail) {
			events = await collection.find({ userEmail: userEmail }).toArray();
		} else {
			events = await collection.find().toArray();
		}

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(200).json(events);
	} catch (error) {
		console.error("Error retrieving events:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

exports.getEventsByEmail = async (req, res) => {
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const userEmail = req.query.userEmail;
		let events;

		if (userEmail) {
			events = await collection.find({ userEmail: userEmail }).toArray();
		} else {
			res.status(400).send({ message: "No userEmail provided" });
			return;
		}

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(200).json(events);
	} catch (error) {
		console.error("Error retrieving events:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

exports.requestToJoinEvent = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;
  
	try {
		
		const database = db.db('create_events')
		const result = await database.collection('events').findOneAndUpdate(
            { _id: new ObjectId(eventId) },
            { $push: { pending: userEmail } },
            { returnOriginal: false }
        );
		      if (result) {
			      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            res.status(200).json({ message: 'Event joined successfully' });
        } else {
            // If item not found
            res.status(404).json({ message: 'Item not found' });
        }
	} catch (error) {
		console.error('Error joining event:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

exports.getMyPendingEventsByEmail = async (req, res) => {
	const userEmail = req.query.userEmail;

    try {

		    const database = db.db("create_events");
		    const collection = database.collection("events");;
        const result = await collection.find({pending: userEmail }).toArray();
        if (result.length > 0) {
			res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            res.status(200).json(result);
        } else {
            res.status(400).json({ message: 'No matching items found' });
        }
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    console.log("Trying to delete", eventId);

    try {
        const database = db.db("create_events");
        const collection = database.collection("events");

        const result = await collection.deleteOne({ _id: new ObjectId(eventId) });

        if (result.deletedCount > 0) {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            res.status(200).json({ message: "Event deleted successfully" });
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
