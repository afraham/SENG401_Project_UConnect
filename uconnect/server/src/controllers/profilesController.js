const db = require("../db/db");

exports.createProfile = async (req, res) => {
	try {
		const database = db.db("create_profiles");
		const collection = database.collection("profiles");

		const profileData = req.body;

		// Validate name and email
		if (!profileData.name || profileData.name.trim() === "") {
			return res.status(400).send({ message: "Name is required" });
		}
		if (!profileData.email || profileData.email.trim() === "") {
			return res.status(400).send({ message: "Email is required" });
		}

		const result = await collection.insertOne(profileData);

		console.log(`Successfully inserted profile with _id: ${result.insertedId}`);
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(201).send({ message: "Profile created successfully" });
	} catch (error) {
		console.error("Error inserting profile:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};
