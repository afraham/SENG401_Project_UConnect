import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FindEvents from "../events/FindEvents";

const mockEvents = []; // Empty array to simulate no events

const mockRefetchEvents = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));



describe("FindEvents", () => {
  beforeEach(() => {
    render(
      <FindEvents events={mockEvents} refetchEvents={mockRefetchEvents} />
    );
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocked fetch after each test
  });

  test("renders 'no events match' message", async () => {
    // Ensure that the 'no events match' message is rendered
    expect(screen.getByText(/No events match/i)).toBeInTheDocument();
  });


  
});
