import { render, fireEvent } from "@testing-library/react";
import AddEvents from "../events/AddEvents.js";

test("renders without crashing", () => {
    render(<AddEvents />);
});

test("displays 'Add New Event' header", () => {
    const { getByText } = render(<AddEvents />);
    expect(getByText("Add New Event")).toBeInTheDocument();
});

test("displays 'Create' button", () => {
    const { getByText } = render(<AddEvents />);
    expect(getByText("Create")).toBeInTheDocument();
});

test("incrementPeople function works correctly", () => {
    const { getByText } = render(<AddEvents />);
    fireEvent.click(getByText("+"));
    expect(getByText("3")).toBeInTheDocument();
});

test("decrementPeople function works correctly", () => {
    const { getByText } = render(<AddEvents />);
    fireEvent.click(getByText("-"));
    expect(getByText("2")).toBeInTheDocument();
});