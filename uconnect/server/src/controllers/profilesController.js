const db = require("../db/db");

exports.createProfile = async (req, res) => {
    try {
        const database = db.db("create_profiles");
        const collection = database.collection("profiles");

        const profileData = req.body;

        const result = await collection.insertOne(profileData);

        console.log(`Successfully inserted profile with _id: ${result.insertedId}`);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(201).send({ message: "Profile created successfully" });
    } catch (error) {
        console.error("Error inserting profile:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
