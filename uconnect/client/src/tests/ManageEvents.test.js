import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
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
  approved: [],
  comments: [],
};

const mockProfileData = {
  "test1@test.com": {
    name: "Test User 1",
    email: "test1@test.com",
    bio: "Fully functional!",
    interests: ["interest1", "interest2"],
  },
  "test2@test.com": {
    name: "Test User 2",
    email: "test2@test.com",
    bio: "Another bio",
    interests: ["interest3", "interest4"],
  },
};

global.fetch = jest.fn().mockImplementation((url) => {
  const email = url.split("/").pop();
  const profileData = mockProfileData[email];
  if (profileData) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(profileData),
    });
  } else {
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: "Not Found" }),
    });
  }
});

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders event title", () => {
    const titleElement = screen.getByText(/Test Event/i);
    expect(titleElement).toBeInTheDocument();
  });



  test("displays 'No requests right now, come back later' message", () => {
    render(<ManageEvents event={mockEvent} />);
    const noRequestsMessages = screen.getAllByText(
      /No requests right now, come back later!/i
    );
    noRequestsMessages.forEach((message) => {
      expect(message).toBeInTheDocument();
    });
  });










});
