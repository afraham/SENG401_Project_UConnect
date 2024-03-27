import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ManageEvents from "../events/ManageEvents";
import mongoose from "mongoose";

const mockEvent = {
	_id: "1",
	title: "Test Event",
	description: "This is a test event",
	date: "2022-01-01T12:00:00",
	location: "Test Location",
	spotsTaken: 0,
	maxPeople: 10,
	pending: ["test1@test.com", "test2@test.com"],
};

const mockClosePopup = jest.fn();
const mockRefetchEvents = jest.fn();

describe("ManageEvents", () => {
	beforeEach(() => {
		render(
			<ManageEvents
				closePopup={mockClosePopup}
				event={mockEvent}
				title="Test Event"
				setCurrent={() => {}}
				refetchEvents={mockRefetchEvents}
			/>
		);
	});

	test("renders event title", () => {
		const titleElement = screen.getByText(/Manage Test Event/i);
		expect(titleElement).toBeInTheDocument();
	});

	test("renders requests", () => {
		const request1Element = screen.getByText(/test1@test.com/i);
		const request2Element = screen.getByText(/test2@test.com/i);
		expect(request1Element).toBeInTheDocument();
		expect(request2Element).toBeInTheDocument();
	});

	test("renders approve and deny buttons for unhandled requests", () => {
		const approveButtons = screen.getAllByText(/Approve/i);
		const denyButtons = screen.getAllByText(/Deny/i);
		expect(approveButtons.length).toBe(2);
		expect(denyButtons.length).toBe(2);
	});

	test("handles approve request", async () => {
		// Mock fetch to return a successful response
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({}),
			})
		);

		const approveButtons = screen.getAllByText(/Approve/i);
		approveButtons.forEach((approveButton) => {
			fireEvent.click(approveButton);
		});

		// The buttons should be replaced with "Accepted" messages
		const acceptedMessages = await screen.findAllByText(/Accepted/i);
		expect(acceptedMessages.length).toBe(2);
	});

	test("handles deny request", async () => {
		// Mock fetch to return a successful response
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({}),
			})
		);

		const denyButtons = screen.getAllByText(/Deny/i);
		denyButtons.forEach((denyButton) => {
			fireEvent.click(denyButton);
		});

		// The buttons should be replaced with "Denied" messages
		const deniedMessages = await screen.findAllByText(/Denied/i);
		expect(deniedMessages.length).toBe(2);
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});
});
