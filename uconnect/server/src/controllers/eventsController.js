const db = require("../db/db");
const { ObjectId } = require("mongodb");

/*
createEvent
Post function to create a new event and send to database

Params: req, res
Returns: None
*/
exports.createEvent = async (req, res) => {
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const eventData = req.body;

		const result = await collection.insertOne(eventData);

		console.log(`Successfully inserted event with _id: ${result.insertedId}`);
		res.setHeader("Access-Control-Allow-Origin", "*");
		res
			.status(201)
			.send({ _id: result.insertedId, message: "Event created successfully" });
	} catch (error) {
		console.error("Error inserting event:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

/*
getEvents
Retrieves all events and uses req'query property to see if userEmail is entered. If userEmail exists retrieve all events that do not contain the userEmail,
else do not retrieve any events.

Params: req, res
Returns: None
*/
exports.getEvents = async (req, res) => {
    try {
        const database = db.db("create_events");
        const collection = database.collection("events");

        const events = await collection.find().toArray();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json(events);
    } catch (error) {
        console.error("Error retrieving events:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

/*
getEventsByEmail
Retrieves all events and uses req query property to see if userEmail is entered. If userEmail exists retrieve all events belonging to the userEmail
else do not retrieve any events.

Params: req, res
Returns: None
*/
exports.getEventsByEmail = async (req, res) => {
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const userEmail = req.query.userEmail;
		let events;

		if (userEmail) {
			events = await collection.find({ userEmail: userEmail }).toArray(); // Find and retrieves all events with user as owner
		} else {
			res.status(400).send({ message: "No userEmail provided" });
			return;
		}

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).json(events);
	} catch (error) {
		console.error("Error retrieving events:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

/*
requestToJoin
Updates array of pending requests for a specified event from the eventId. Requires a userEmail and an eventId from the req body and params property.

Params: req, res
Returns: None
*/
exports.requestToJoinEvent = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;

	try {
		const database = db.db("create_events");
		const result = await database.collection("events").findOneAndUpdate(
			{ _id: new ObjectId(eventId) }, // Find by eventId
			{ $push: { pending: userEmail } }, // append userEmail to pending array
			{ returnOriginal: false } // Does not return original item
		);
		if (result) {
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.status(200).json({ message: "Event joined successfully" });
		} else {
			// If item not found
			res.status(404).json({ message: "Item not found" });
		}
	} catch (error) {
		console.error("Error joining event:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

/*
getMyPendingEventsByEmail
Retrieves all pending events and uses req query property to see if userEmail is entered. If userEmail exists retrieve all events containing userEmail in the pending array
else do not retrieve any events.

Params: req, res
Returns: None
*/
exports.getMyPendingEventsByEmail = async (req, res) => {
	const userEmail = req.query.userEmail;

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");
		const result = await collection.find({ pending: userEmail }).toArray(); // Retrieves all events containing userEmail in pending array
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).json(result);
	} catch (error) {
		console.error("Error searching items:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

/*
getMyJoinedEventsByEmail
Retrieves all joined events and uses req query property to see if userEmail is entered. If userEmail exists retrieve all events containing userEmail in the approved array
else do not retrieve any events.

Params: req, res
Returns: None
*/
exports.getMyJoinedEventsByEmail = async (req, res) => {
	const userEmail = req.query.userEmail;

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");
		const result = await collection.find({ approved: userEmail }).toArray(); // Retrieves all events containing userEmail in approved array
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).json(result);
	} catch (error) {
		console.error("Error searching items:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

/*
deleteEvent
Requests deletion of an event using an eventId retrieved from req's parameter property.

Params: req, res
Returns: None
*/
exports.deleteEvent = async (req, res) => {
	const { eventId } = req.params;
	console.log("Trying to delete", eventId);

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const result = await collection.deleteOne({ _id: new ObjectId(eventId) }); // Removes event by eventId in database

		if (result.deletedCount > 0) {
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.status(200).json({ message: "Event deleted successfully" });
		} else {
			res.status(404).json({ message: "Event not found" });
		}
	} catch (error) {
		console.error("Error deleting event:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

/*
approveUser
Moves userEmail from pending array to approved array in database for an event from an eventId. Increment spotsTaken by 1.

Params: req, res
Returns: res if failed
*/
exports.approveUser = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");

		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(eventId) }, // Find event by id
			{
				$inc: { spotsTaken: 1 }, // Incremenet number of spots taken
				$pull: { pending: userEmail }, // Remove userEmail from pending array
				$push: { approved: userEmail }, // Append userEmail to approved array
			},
			{ returnOriginal: false } // Do not return original item
		);

		res.setHeader("Access-Control-Allow-Origin", "*");

		if (result.modifiedCount === 0) {
			return res
				.status(404)
				.json({ message: "Item not found or element not removed" });
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

/*
denyUser
Removes user from pending array of a specified event from eventId passed by req's param property. Does not increment capacity.

Params: req, res
Returns: res if failed
*/
exports.denyUser = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");
		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(eventId) }, // Find event by id
			{
				$pull: { pending: userEmail }, // Remove user from pending array
			},
			{ new: true } // Returns ne item
		);

		res.setHeader("Access-Control-Allow-Origin", "*");

		if (result.modifiedCount === 0) {
			return res
				.status(404)
				.json({ message: "Item not found or element not removed" });
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

/*
updateEvent
Update an event's field in database from an eventId with the request paramaters and replace old eventData with eventDataToUpdate in the item using the request body. 

Params: req, res
Returns: res if failed
*/
exports.updateEvent = async (req, res) => {
	const { eventId } = req.params; // Extract eventId from request parameters
	const eventDataToUpdate = req.body; // Updated event data sent from the client

	try {
		// Find the event by ID and update only the specified fields
		const database = db.db("create_events");
		const updatedEvent = await database.collection("events").findOneAndUpdate(
			{ _id: new ObjectId(eventId) }, // Find event by id
			{ $set: eventDataToUpdate }, // Replace fields to existing eventDataToUpdate
			{ returnOriginal: false } // Do not return original item
		);

		// Check if event exists
		if (!updatedEvent) {
			console.log("Event ID:", eventId);
			console.log(eventDataToUpdate);
			return res.status(404).json({ error: "Event not found" });
		}

		// Send the updated event as response
		res
			.status(200)
			.json({ message: "Event updated successfully", event: updatedEvent });
	} catch (error) {
		console.error("Error updating event:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/*
addCommentToEvent
Find event from eventId using request parameters and append a comment to the comments array. 

Params: req, res
Returns: None
*/

exports.addCommentToEvent = async (req, res) => {
	const data = req.body;
	const { eventId } = req.params;
	try {
		const database = db.db("create_events");
		const collection = database.collection("events");
		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(eventId) }, // Find event by id
			{
				$push: { comments: data }, // Appends comment data to comments array
			},
			{ returnNewDocument: true } // Return the new item
		);

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

/*
userLeftEvent
Find event from eventId using request parameters and remove userEmail from approved array. Decrement spotsTaken field. 

Params: req, res
Returns: None
*/
exports.userLeftEvent = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");
		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(eventId) }, // Find event by id
			{
				$inc: { spotsTaken: -1 }, // Decrement spots taken
				$pull: { approved: userEmail }, // Remove userEmail from approved array
			},
			{ returnOriginal: false } // Do not reutrn original
		);

		res.setHeader("Access-Control-Allow-Origin", "*");

		if (result.modifiedCount === 0) {
			return res
				.status(404)
				.json({ message: "Item not found or element not removed" });
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

/*
cancelPending
Find event from eventId using request parameters and remove user from pending array.

Params: req, res
Returns: res if unmodified
*/

exports.cancelPending = async (req, res) => {
	const { eventId } = req.params;
	const { userEmail } = req.body;

	console.log("Event ID:", eventId);
	console.log("User Email:", userEmail);

	try {
		const database = db.db("create_events");
		const collection = database.collection("events");
		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(eventId) }, // Find event by id
			{
				$pull: { pending: userEmail }, // Remove userEmail from pending array
			},
			{ returnOriginal: false } // Do not return original item
		);

		res.setHeader("Access-Control-Allow-Origin", "*");

		if (result.modifiedCount === 0) {
			return res
				.status(404)
				.json({ message: "Item not found or element not removed" });
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};
