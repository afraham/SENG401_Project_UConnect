import { render, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import FindEvents from "../events/FindEvents.js";

fetchMock.enableMocks();

beforeEach(() => {
	fetchMock.mockResponseOnce(
		JSON.stringify([
			{
				title: "Test Event",
				spotsTaken: 0,
				maxPeople: 5,
				description: "Test Description",
				location: "Test Location",
			},
		])
	);
});

test("renders without crashing", () => {
	render(<FindEvents />);
});

test("displays 'Request To Join' button after fetch", async () => {
	const { findByText } = render(<FindEvents />);
	await waitFor(() =>
		expect(findByText("Request To Join")).toBeInTheDocument()
	);
});

test("displays event title after fetch", async () => {
	const { findByText } = render(<FindEvents />);
	await waitFor(() => expect(findByText("Test Event")).toBeInTheDocument());
});

test("displays event description after fetch", async () => {
	const { findByText } = render(<FindEvents />);
	await waitFor(() =>
		expect(findByText("Test Description")).toBeInTheDocument()
	);
});

test("displays event location after fetch", async () => {
	const { findByText } = render(<FindEvents />);
	await waitFor(() => expect(findByText("Test Location")).toBeInTheDocument());
});
