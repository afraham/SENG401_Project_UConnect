// file for connecting to the database
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
	"mongodb+srv://uconnect:uconnect123@uconnectdb.xi1eihr.mongodb.net/";
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

module.exports = client;
