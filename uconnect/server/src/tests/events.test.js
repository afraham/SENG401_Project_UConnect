const request = require("supertest");
const express = require("express");
const router = require("../routes/events");
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(express.json());
app.use("/", router);

describe("Events Routes", () => {
	let eventId;
	let eventId_temp;

	beforeAll(async () => {
		return request(app)
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
			.then((res) => {
				console.log(res.body); // log the entire response body

				eventId = res.body._id; // assign the returned eventId
				console.log(`Event ID: ${eventId}`); // log the eventId
			});
	});

	describe("POST /api/events", () => {
		it("should create a new event", async () => {
			const eventData = {
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
			};
			const res = await request(app).post("/api/events").send(eventData);

			eventId_temp = res.body._id; // Assign the _id to eventId_temp

			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty("message", "Event created successfully");
		});
	});

	describe("GET /api/events", () => {
		it("should fetch all events", async () => {
			const res = await request(app)
				.get("/api/events")
				.query({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(Array.isArray(res.body)).toBe(true);
		});
	});

	// should try to change it to a general eventid but... it works with an
	// existing eventid :( so it's not a good test
	describe("PUT /api/events/:eventId/join", () => {
		it("should request to join an event", async () => {
			const res = await request(app)
				.put(`/api/events/${eventId}/join`) // pass eventId directly
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
		test("should add a comment to an event", async () => {
			const comment = {
				message: "This is a test comment",
				userEmail: "jest@beforeAll.com",
			};

			console.log(eventId);

			const res = await request(app)
				.put(`/api/eventById/${eventId}`)
				.send(comment);

			console.log(res.body);

			expect(res.status).toBe(200);
			expect(res.body._id).toEqual(eventId);
		});

		it("should return 500 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/eventById/${nonExistentId.toString()}`)
				.send({
					message: "This is a test comment",
					userEmail: "jest@beforeAll.com",
				});

			expect(res.statusCode).toEqual(200);
		});
	});

	describe("DELETE /api/events/:eventId", () => {
		it("should delete an event", async () => {
			const res = await request(app).delete(
				`/api/events/${eventId_temp.toString()}`
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
				.put(`/api/events/approve/${eventId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(res.body.approved).not.toContain("jest@beforeAll.com");
		});

		it("should return 500 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/events/approve/${nonExistentId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(500);
		});
	});

	describe("PUT /api/events/deny/:eventId", () => {
		it("should deny a user for an event", async () => {
			const res = await request(app)
				.put(`/api/events/deny/${eventId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(res.body.pending).not.toContain("jest@beforeAll.com");
		});

		it("should return 500 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/events/deny/${nonExistentId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(500);
			expect(res.body).toHaveProperty("message", "Internal Server Error");
		});
	});

	describe("PUT /api/events/leave/:eventId", () => {
		it("should make a user leave an event", async () => {
			const res = await request(app)
				.put(`/api/events/leave/${eventId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(200);
			expect(res.body.approved).toContain("jest@beforeAll.com");
		});

		it("should return 500 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/events/leave/${nonExistentId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(500);
			expect(res.body).toHaveProperty("message", "Internal Server Error");
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

			console.log(res.body);

			expect(res.statusCode).toEqual(200);
			expect(res.body.pending).not.toContain("jest@beforeAll.com");
		});

		it("should return 500 if the event does not exist", async () => {
			const nonExistentId = new ObjectId(); // generate a new ObjectId
			const res = await request(app)
				.put(`/api/events/cancelPending/${nonExistentId.toString()}`)
				.send({ userEmail: "jest@beforeAll.com" });

			expect(res.statusCode).toEqual(500);
			expect(res.body).toHaveProperty("message", "Internal Server Error");
		});
	});
});
