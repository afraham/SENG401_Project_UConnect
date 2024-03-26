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

exports.fetchProfileInfo = async (req, res) => {
    try {
      const email = req.params;
      console.log("email that was sent:", email);
      const database = db.db("create_profiles");
      const collection = database.collection("profiles");
  
      const profile = await collection.findOne({ email: email });
  
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

