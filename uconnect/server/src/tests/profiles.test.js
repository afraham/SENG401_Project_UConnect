const request = require("supertest");
const express = require("express");
const router = require("../routes/profiles");
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(express.json());
app.use("/", router);

describe("POST /api/profiles", () => {
	it("should create a new profile", async () => {
		const profileData = {
			name: "Jest User",
			email: "jest@user.com",
			bio: "This is a test user created by Jest.",
		};
		const res = await request(app).post("/api/profiles").send(profileData);

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("message", "Profile created successfully");
	});

	// You can add more tests here to check for specific error cases,
	// such as trying to create a profile with an email that already exists in the database
});
