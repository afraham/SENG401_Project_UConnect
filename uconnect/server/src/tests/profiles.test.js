const request = require("supertest");
const express = require("express");
const router = require("../routes/profiles");
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(express.json());
app.use("/", router);

describe("Profile Routes", () => {
	describe("POST /api/profiles", () => {
		it("should create a new profile", async () => {
			const profileData = {
				name: "Jest User",
				email: "jest@user.com",
				bio: "This is a test user created by Jest.",
			};
			const res = await request(app).post("/api/profiles").send(profileData);

			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty(
				"message",
				"Profile created successfully"
			);
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
		});
	});

	describe("PUT /api/profiles/update", () => {
		it("should update an existing profile", async () => {
			const profileData = {
				email: "jest@user.com",
				name: "Updated Jest User",
				bio: "This is an updated test user created by Jest.",
			};
			const res = await request(app)
				.put("/api/profiles/update")
				.send(profileData);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty(
				"message",
				"Profile updated/created successfully"
			);
		});

		it("should return 500 if the email is not provided", async () => {
			const invalidProfileData = {
				name: "Updated Jest User",
				bio: "This is an updated test user created by Jest.",
			};
			const res = await request(app)
				.put("/api/profiles")
				.send(invalidProfileData);

			expect(res.statusCode).toEqual(404);
		});
	});

	describe("GET /api/profiles/:email", () => {
		it("should fetch a profile", async () => {
			const email = "jest@user.com";
			const res = await request(app).get(`/api/profiles/${email}`);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("email", email);
		});

		it("should return 404 if the profile is not found", async () => {
			const email = "nonexistent@user.com";
			const res = await request(app).get(`/api/profiles/${email}`);

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty("message", "Profile not found");
		});
	});
});
