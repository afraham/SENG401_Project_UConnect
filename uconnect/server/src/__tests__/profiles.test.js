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

	it("should return 400 if the name is blank", async () => {
		const invalidProfileData = {
			name: "",
			email: "jest@user.com",
			bio: "This is a test user created by Jest.",
		};
		const res = await request(app)
			.post("/api/profiles")
			.send(invalidProfileData);

		expect(res.statusCode).toEqual(400);
		expect(res.body).toHaveProperty("message", "Name is required");
	});

	it("should return 400 if the email is blank", async () => {
		const invalidProfileData = {
			name: "Jest User",
			email: "",
			bio: "This is a test user created by Jest.",
		};
		const res = await request(app)
			.post("/api/profiles")
			.send(invalidProfileData);

		expect(res.statusCode).toEqual(400);
		expect(res.body).toHaveProperty("message", "Email is required");
	});
});
