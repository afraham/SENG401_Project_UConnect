const db = require("../db/db");
const { ObjectId } = require('mongodb')

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
			events = await collection.find({ 
				$and: [
					 {userEmail: { $ne: userEmail }},
					 {pending: { $nin: [userEmail] }},
					 {approved: { $nin: [userEmail] }}
				]}).toArray();
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
		const collection = database.collection("events");
        const result = await collection.find({pending: userEmail }).toArray();
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(200).json(result);
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getMyJoinedEventsByEmail = async (req, res) => {
	const userEmail = req.query.userEmail;

    try {
		const database = db.db("create_events");
		const collection = database.collection("events");
        const result = await collection.find({approved: userEmail }).toArray();
		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.status(200).json(result);
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

exports.approveUser = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(eventId) },
            {
				$inc: { spotsTaken: 1 },
                $pull: { pending: userEmail }, // Remove element from array
                $push: { approved: userEmail } // Append element to another array
            },
			{ returnOriginal: false }
        );

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Item not found or element not removed' });
        }
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
}

exports.denyUser = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");
		const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(eventId) },
            {
                $pull: { pending: userEmail } // Remove element from array
            },
			{ new: true }
        );

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Item not found or element not removed' });
        }
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
}

// exports.updateEvent = async (req, res) => {
//     const { eventId } = req.params;
//     const eventData = req.body;

//     try {
//         console.log("Updating event with ID:", eventId);
//         console.log("Event data:", eventData);

//         const database = db.db("create_events");
//         const collection = database.collection("events");

//         const result = await collection.findOneAndUpdate(
//             { _id: new ObjectId(eventId) },
//             { $set: eventData },
//             { returnOriginal: false }
//         );

//         console.log("Update result:", result);

//         if (result.value) {
//             res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//             res.status(200).json({ message: "Event updated successfully", event: result.value });
//         } else {
//             res.status(400).json({ message: "Event not found" });
//         }
//     } catch (error) {
//         console.error("Error updating event:", error);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

exports.updateEvent = async (req, res) => {
    const { eventId } = req.params; // Extract eventId from request parameters
    const eventDataToUpdate = req.body; // Updated event data sent from the client

    try {
        // Find the event by ID and update only the specified fields
		const database = db.db('create_events')
		const updatedEvent = await database.collection('events').findOneAndUpdate(
			{ _id: new ObjectId(eventId) },
			{ $set: eventDataToUpdate },
			{ returnOriginal: false }
		);

        // Check if event exists
        if (!updatedEvent) {
			console.log("Event ID:", eventId);
			console.log(eventDataToUpdate);
            return res.status(404).json({ error: 'Event not found' });
        }

        // Send the updated event as response
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
exports.userLeftEvent = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");
		const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(eventId) },
            {
				$inc: { spotsTaken: -1 },
                $pull: { approved: userEmail } // Remove element from array
            },
			{ returnOriginal: false }
        );

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Item not found or element not removed' });
        }
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
}
