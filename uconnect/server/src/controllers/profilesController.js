const db = require("../db/db");

exports.updateProfile = async (req, res) => {
    try {
        const database = db.db("create_profiles");
        const collection = database.collection("profiles");

        const { email, ...profileData } = req.body; // Extract email from req.body

        const result = await collection.updateOne({ email: email }, { $set: profileData }, { upsert: true });

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



