const db = require("../db/db");

/*
updateProfile
Find profile by email and replace fields with new profiledata.

Params: req, res
Returns: None
*/

exports.updateProfile = async (req, res) => {
	try {
		const database = db.db("create_profiles");
		const collection = database.collection("profiles");

		const { email, _id, ...profileData } = req.body; // Extract email and _id from req.body

		const result = await collection.updateOne(
			{ email: email },
			{ $set: profileData },
			{ upsert: true }
		); // Find by email and set profileData to new profile data

		if (result.upsertedCount > 0) {
			console.log(`Successfully created profile with email: ${email}`);
		} else {
			console.log(`Successfully updated profile with email: ${email}`);
		}

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send({ message: "Profile updated/created successfully" });
	} catch (error) {
		console.error("Error updating/creating profile:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

/*
fetchProfileInfo
Fetch entire profile item from user's email.

Params: req, res
Returns: None
*/
exports.fetchProfileInfo = async (req, res) => {
	try {
		const email = req.params.email;
		console.log("Email that was sent:", email);
		const database = db.db("create_profiles");
		const collection = database.collection("profiles");

		const profile = await collection.findOne({ email: email }); // Find by userEmail
		//console.log("Profile found:", profile); // Log the profile

		if (!profile) {
			res.status(404).send({ message: "Profile not found" });
			return;
		}

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send(profile);
	} catch (error) {
		console.error("Error fetching profile information:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

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
