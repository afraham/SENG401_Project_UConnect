import { render, fireEvent } from "@testing-library/react";
import Profile from "../profile/Profile.js";

describe("Profile", () => {
	test("renders without crashing", () => {
		render(<Profile />);
	});

	test("displays default profile picture", () => {
		const { getByAltText } = render(<Profile />);
		const imageElement = getByAltText("Profile");
		expect(imageElement.src).toContain("default_picture.jpg");
	});

	test("displays profile name", () => {
		const { getByText } = render(<Profile />);
		const nameElement = getByText("Firstname Lastname");
		expect(nameElement).toBeInTheDocument();
	});

	test("displays profile email", () => {
		const { getByText } = render(<Profile />);
		const emailElement = getByText("email@example.com");
		expect(emailElement).toBeInTheDocument();
	});

	test("displays and triggers edit button", () => {
		const { getByRole } = render(<Profile />);
		const editButton = getByRole("button", { name: /edit/i });
		expect(editButton).toBeInTheDocument();

		fireEvent.click(editButton);
		const saveButton = getByRole("button", { name: /save/i });
		expect(saveButton).toBeInTheDocument();
	});
});
