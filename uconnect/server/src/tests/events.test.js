const request = require("supertest");
const express = require("express");
const router = require("../routes/events");
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(express.json());
app.use("/", router);

describe("Events Routes", () => {
	let eventId;
	let eventId1;

	beforeAll((done) => {
		request(app)
			.post("/api/events")
			.send({
				title: "Jest Event",
				description: "This is an event made by Jest.",
				maxPeople: 3,
				spotsTaken: 0,
				date: "2023-01-01T00:00",
				location: "Jest Location",
				userEmail: "jest@beforeAll.com",
				pending: [],
				approved: [],
				comments: [],
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				eventId = new ObjectId(res.body._id); // convert to ObjectId
				done();
			});
	});

	it("should create a new event", async () => {
		const res = await request(app).post("/api/events").send({
			title: "Jest Event in Block",
			description: "This is an event made by Jest AGAIN!",
			maxPeople: 4,
			spotsTaken: 0,
			date: "2023-01-01T00:00",
			location: "Jest Location",
			userEmail: "jest@beforeAll.com",
			pending: [],
			approved: [],
			comments: [],
		});
		eventId1 = new ObjectId(res.body._id); // convert to ObjectId

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("message", "Event created successfully");
	});

	it("should fetch all events", async () => {
		const res = await request(app)
			.get("/api/events")
			.query({ userEmail: "jest@beforeAll.com" });

		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	// should try to change it to a general eventid but... it works with an
	// existing eventid :( so it's not a good test
	it("should request to join an event", async () => {
		const eventIdA = "660312f57ad729c353204ab6";
		const res = await request(app)
			.put(`/api/events/${eventIdA}/join`) // pass eventId directly
			.send({ userEmail: "jest@beforeAll.com" });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("message", "Event joined successfully");
	});

	it("should return 404 if the event does not exist", async () => {
		const nonExistentId = new ObjectId(); // generate a new ObjectId
		const res = await request(app)
			.put(`/api/events/${nonExistentId.toString()}/join`)
			.send({ userEmail: "jest@beforeAll.com" });

		expect(res.statusCode).toEqual(404);
		expect(res.body).toHaveProperty("message", "Item not found");
	});

	describe("GET /api/eventsByEmail", () => {
		it("should get events by email", async () => {
			const res = await request(app)
				.get("/api/eventsByEmail")
				.query({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
		});

		it("should return 400 if no userEmail provided", async () => {
			const res = await request(app).get("/api/eventsByEmail");

			expect(res.statusCode).toEqual(400);
			expect(res.body).toHaveProperty("message", "No userEmail provided");
		});
	});

	describe("GET /api/pendingEventsByEmail", () => {
		it("should get pending events by email", async () => {
			const res = await request(app)
				.get("/api/pendingEventsByEmail")
				.query({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
		});
	});

	describe("GET /api/joinedEventsByEmail", () => {
		it("should get joined events by email", async () => {
			const res = await request(app)
				.get("/api/joinedEventsByEmail")
				.query({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
		});
	});

	describe("PUT /api/eventById/:eventId", () => {
		it("should add a comment to an event", async () => {
			const res = await request(app)
				.put(`/api/eventById/${eventId.toString()}`)
				.send({
					message: "This is a test comment",
					userEmail: "jest@beforeAll.com",
				});

			expect(res.statusCode).toEqual(200);
			expect(res.body).not.toBeNull();
			expect(res.body.value).not.toBeNull();
			expect(res.body.value.comments).toContainEqual({
				message: "This is a test comment",
				userEmail: "jest@beforeAll.com",
			});
		});

		it("should return 500 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/eventById/${nonExistentId.toString()}`)
				.send({
					comment: "This is a test comment",
					userEmail: "jest@beforeAll.com",
				});

			expect(res.statusCode).toEqual(500);
			expect(res.body).toHaveProperty("message", "Internal Server Error");
		});
	});

	describe("DELETE /api/events/:eventId", () => {
		it("should delete an event", async () => {
			const res = await request(app).delete(
				`/api/events/${eventId.toString()}`
			);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("message", "Event deleted successfully");
		});

		it("should return 404 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app).delete(
				`/api/events/${nonExistentId.toString()}`
			);

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty("message", "Event not found");
		});
	});

	describe("PUT /api/events/approve/:eventId", () => {
		it("should approve a user for an event", async () => {
			const res = await request(app)
				.put(`/api/events/approve/${eventId1.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(res.body.value.approved).toContain("jest@beforeAll.com");
		});

		it("should return 404 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/events/approve/${nonExistentId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(404);
		});
	});

	describe("PUT /api/events/deny/:eventId", () => {
		it("should deny a user for an event", async () => {
			const res = await request(app)
				.put(`/api/events/deny/${eventId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(res.body.value.pending).not.toContain("jest@beforeAll.com");
		});

		it("should return 404 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/events/deny/${nonExistentId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty(
				"message",
				"Item not found or element not removed"
			);
		});
	});

	describe("PUT /api/events/leave/:eventId", () => {
		it("should make a user leave an event", async () => {
			const res = await request(app)
				.put(`/api/events/leave/${eventId1.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(res.body.value.approved).not.toContain("jest@beforeAll.com");
		});

		it("should return 404 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/events/leave/${nonExistentId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty(
				"message",
				"Item not found or element not removed"
			);
		});
	});

	describe("PATCH /api/events/:eventId/edit", () => {
		it("should update an event", async () => {
			const updatedData = {
				title: "Updated Jest Event",
				description: "This is an updated event made by Jest.",
				maxPeople: 5,
			};
			const res = await request(app)
				.patch(`/api/events/${eventId.toString()}/edit`)
				.send(updatedData);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty("message", "Event updated successfully");
			expect(res.body.event.value).toMatchObject(updatedData);
		});

		it("should return 404 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.patch(`/api/events/${nonExistentId.toString()}/edit`)
				.send({ title: "Updated Jest Event" });

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty("error", "Event not found");
		});
	});

	describe("PUT /api/events/cancelPending/:eventId", () => {
		it("should cancel a pending request for an event", async () => {
			const res = await request(app)
				.put(`/api/events/cancelPending/${eventId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(res.body.value.pending).not.toContain("jest@beforeAll.com");
		});

		it("should return 404 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/events/cancelPending/${nonExistentId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty(
				"message",
				"Item not found or element not removed"
			);
		});
	});
});
