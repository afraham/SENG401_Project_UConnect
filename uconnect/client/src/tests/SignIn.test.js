import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import SignIn from "../sign-ins/SignIn";

test("renders SignIn component without crashing", () => {
	const mockChangeSignInState = jest.fn();
	const { getByRole } = render(
		<Router>
			<SignIn changeSignInState={mockChangeSignInState} />
		</Router>
	);
	const linkElement = getByRole("button", { name: /sign in/i });
	expect(linkElement).toBeInTheDocument();
});

test("allows input of email and password", () => {
	const mockChangeSignInState = jest.fn();
	const { getByPlaceholderText } = render(
		<Router>
			<SignIn changeSignInState={mockChangeSignInState} />
		</Router>
	);
	const emailInput = getByPlaceholderText("Enter Email");
	const passwordInput = getByPlaceholderText("Enter Password");

	fireEvent.change(emailInput, { target: { value: "a@gmail.com" } });
	fireEvent.change(passwordInput, { target: { value: "123456" } });

	expect(emailInput.value).toBe("a@gmail.com");
	expect(passwordInput.value).toBe("123456");
});

test("submits the form", () => {
	const mockChangeSignInState = jest.fn();
	const { getByRole } = render(
		<Router>
			<SignIn changeSignInState={mockChangeSignInState} />
		</Router>
	);
	const submitButton = getByRole("button", { name: /sign in/i });

	fireEvent.click(submitButton);
});

jest.mock("firebase/auth", () => ({
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve("Mock sign in")),
    getAuth: jest.fn(() => ({})),
}));

test("calls changeSignInState on form submission", async () => {
    const mockChangeSignInState = jest.fn();
    const { getByRole } = render(
        <Router>
            <SignIn changeSignInState={mockChangeSignInState} />
        </Router>
    );
    const submitButton = getByRole("button", { name: /sign in/i });

    fireEvent.click(submitButton);

    // Wait for any asynchronous actions to complete
    await waitFor(() => {
        expect(mockChangeSignInState).toHaveBeenCalledWith(true);
    });
});
