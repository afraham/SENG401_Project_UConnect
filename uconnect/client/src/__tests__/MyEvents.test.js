import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MyEvents from "../events/MyEvents";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => jest.fn(),
}));
global.alert = jest.fn();

describe("MyEvents", () => {
	test("opens AddEvents popup when '+' button is clicked", async () => {
		render(<MyEvents />);
		const addButton = screen.getByText("+");
		fireEvent.click(addButton);
		await waitFor(() => {
			expect(screen.getByTestId("event-button")).toBeInTheDocument();
		});
	});

	test("renders correct number of tabs", () => {
		const { getByText } = render(<MyEvents />);

		expect(getByText("My Events (0)")).toBeInTheDocument();
		expect(getByText("Pending (0)")).toBeInTheDocument();
		expect(getByText("Joined (0)")).toBeInTheDocument();
	});

	test('adds a new event when "Create" button is clicked', () => {
		// Render your component and perform necessary setup

		render(<MyEvents />);
		const addButton = screen.getByText("+");
		const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});
		fireEvent.click(addButton);
		const createButton = screen.getByText("Create");

		// Simulate user interaction that triggers the alert
		fireEvent.click(createButton);

		// Expect that the alert function is called
		expect(mockAlert).toHaveBeenCalledWith("Please fill in all fields.");
		mockAlert.mockRestore();
	});
});
