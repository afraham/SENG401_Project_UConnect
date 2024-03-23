import { render, fireEvent } from "@testing-library/react";
import MyEvents from "../events/MyEvents.js";

test("renders without crashing", () => {
	render(<MyEvents />);
});

test("displays add event button", () => {
	const { getByText } = render(<MyEvents />);
	expect(getByText("+")).toBeInTheDocument();
});

test("displays and triggers add event button", () => {
	const { getByText } = render(<MyEvents />);
	const addButton = getByText("+");
	expect(addButton).toBeInTheDocument();

	fireEvent.click(addButton);
	expect(getByText("Add New Event")).toBeInTheDocument();
});

test("displays AddEvents component when add event button is clicked", () => {
	const { getByText, queryByText } = render(<MyEvents />);
	const addButton = getByText("+");

	fireEvent.click(addButton);
	expect(queryByText("Add New Event")).toBeInTheDocument();
});

test("does not display AddEvents component when close button is clicked", () => {
	const { getByText, queryByText } = render(<MyEvents />);
	const addButton = getByText("+");

	fireEvent.click(addButton);
	const closeButton = getByText("X");

	fireEvent.click(closeButton);
	expect(queryByText("Add Event")).not.toBeInTheDocument();
});
