const request = require("supertest");
const express = require("express");
const router = require("../routes/events"); // adjust the path to your events router
const ObjectId = require("mongodb").ObjectId;

// Create a test app
const app = express();
app.use(express.json());
app.use("/", router);

describe("Events Routes", () => {
	let eventId;

	beforeAll(async () => {
		const res = await request(app).post("/api/events").send({
			title: "Jest Event",
			description: "This is an event made by Jest.",
			maxPeople: 3,
			spotsTaken: 0,
			date: "2023-01-01T00:00",
			location: "Jest Location",
			userEmail: "jest@example.com",
			pending: [],
			approved: [],
			comments: [],
		});

		eventId = new ObjectId(res.body._id); // convert to ObjectId
	});

	it("should create a new event", async () => {
		const res = await request(app).post("/api/events").send({
			title: "Jest Event in Block",
			description: "This is an event made by Jest AGAIN!",
			maxPeople: 4,
			spotsTaken: 0,
			date: "2023-01-01T00:00",
			location: "Jest Location",
			userEmail: "jest@example.com",
			pending: [],
			approved: [],
			comments: [],
		});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("message", "Event created successfully");
	});

	it("should fetch all events", async () => {
		const res = await request(app)
			.get("/api/events")
			.query({ userEmail: "jest@example.com" });

		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it("should request to join an event", async () => {
		const res = await request(app)
			.put(`/api/events/${eventId.toString()}/join`)
			.send({ userEmail: "jestJoin@example.com" });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("message", "Event joined successfully");
	});

	it("should return 404 if the event does not exist", async () => {
		const nonExistentId = new ObjectId(); // generate a new ObjectId
		const res = await request(app)
			.put(`/api/events/${nonExistentId.toString()}/join`)
			.send({ userEmail: "jest@example.com" });
	
		expect(res.statusCode).toEqual(404);
		expect(res.body).toHaveProperty("message", "Item not found");
	});
});
