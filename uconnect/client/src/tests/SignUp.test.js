import { render, fireEvent, waitFor } from "@testing-library/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import SignUp from "../sign-ins/SignUp";

test("renders without crashing", () => {
	<Router>
		render(
		<SignUp />
		);
	</Router>;
});

test("renders sign in link", () => {
	const { getByText } = render(
		<MemoryRouter>
			<SignUp />
		</MemoryRouter>
	);
	const linkElement = getByText("Already have an account? Sign In");
	expect(linkElement).toBeInTheDocument();
	expect(linkElement.getAttribute("href")).toBe("/");
});

jest.mock("firebase/auth", () => ({
	createUserWithEmailAndPassword: jest.fn(() =>
		Promise.resolve("Mock sign up")
	),
	getAuth: jest.fn(() => ({})),
}));

test("calls createUserWithEmailAndPassword on form submission", async () => {
	const { getByRole } = render(
		<MemoryRouter>
			<SignUp />
		</MemoryRouter>
	);
	const submitButton = getByRole("button", { name: /sign up/i });

	fireEvent.click(submitButton);

	// Wait for any asynchronous actions to complete
	await waitFor(() => {
		expect(createUserWithEmailAndPassword).toHaveBeenCalled();
	});
});

test("updates email state on input change", () => {
	const { getByPlaceholderText } = render(
		<MemoryRouter>
			<SignUp />
		</MemoryRouter>
	);
	const emailInput = getByPlaceholderText("Enter Your Email");

	fireEvent.change(emailInput, { target: { value: "test@example.com" } });

	expect(emailInput.value).toBe("test@example.com");
});

test("updates password state on input change", () => {
	const { getByPlaceholderText } = render(
		<MemoryRouter>
			<SignUp />
		</MemoryRouter>
	);
	const passwordInput = getByPlaceholderText("Create a Password");

	fireEvent.change(passwordInput, { target: { value: "password" } });

	expect(passwordInput.value).toBe("password");
});
