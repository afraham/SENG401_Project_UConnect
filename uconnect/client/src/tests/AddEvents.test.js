import { render, fireEvent } from "@testing-library/react";
import AddEvents from "../events/AddEvents";

describe("AddEvents", () => {
	const mockClosePopup = jest.fn();
	const mockUpdateEvents = jest.fn();

	test("renders without crashing", () => {
		render(
			<AddEvents closePopup={mockClosePopup} updateEvents={mockUpdateEvents} />
		);
	});

	test("displays correct title for adding new event", () => {
		const { getByText } = render(
			<AddEvents closePopup={mockClosePopup} updateEvents={mockUpdateEvents} />
		);
		expect(getByText("Add New Event")).toBeInTheDocument();
	});

	test("displays correct title for editing event", () => {
		const mockEvent = {
			title: "Test",
			description: "Test",
			maxPeople: 2,
			date: "2022-01-01",
			location: "Test",
		};
		const { getByText } = render(
			<AddEvents
				closePopup={mockClosePopup}
				event={mockEvent}
				editMode={true}
				updateEvents={mockUpdateEvents}
			/>
		);
		expect(getByText("Edit Event")).toBeInTheDocument();
	});

	test("calls closePopup when close button is clicked", () => {
		const { getByText } = render(
			<AddEvents closePopup={mockClosePopup} updateEvents={mockUpdateEvents} />
		);
		fireEvent.click(getByText("X"));
		expect(mockClosePopup).toHaveBeenCalled();
	});

	test("calls saveEventData when Create button is clicked", () => {
		const { getByText } = render(
			<AddEvents closePopup={mockClosePopup} updateEvents={mockUpdateEvents} />
		);
		fireEvent.click(getByText("Create"));
	});

	test("calls handleUpdateEvent when Save Changes button is clicked", () => {
		const mockEvent = {
			_id: "1",
			title: "Test",
			description: "Test",
			maxPeople: 2,
			date: "2022-01-01",
			location: "Test",
		};
		const { getByText } = render(
			<AddEvents
				closePopup={mockClosePopup}
				event={mockEvent}
				editMode={true}
				updateEvents={mockUpdateEvents}
			/>
		);
		fireEvent.click(getByText("Save Changes"));
	});
});
