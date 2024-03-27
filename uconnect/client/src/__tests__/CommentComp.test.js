import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import CommentComp from "../events/CommentComp";
import mongoose from "mongoose";

describe("CommentComp", () => {
	const mockCommentHistory = [
		{ userEmail: "test1@example.com", message: "Test message 1" },
		{ userEmail: "test2@example.com", message: "Test message 2" },
	];

	test("renders without crashing", () => {
		render(
			<Router>
				<CommentComp commentHistory={mockCommentHistory} />
			</Router>
		);
	});

	test("displays correct title", () => {
		const { getByText } = render(
			<Router>
				<CommentComp commentHistory={mockCommentHistory} />
			</Router>
		);
		expect(getByText("Chat Box")).toBeInTheDocument();
	});

	test("displays comments from commentHistory", () => {
		const { getByText } = render(
			<Router>
				<CommentComp commentHistory={mockCommentHistory} />
			</Router>
		);
		expect(getByText("test1@example.com: Test message 1")).toBeInTheDocument();
		expect(getByText("test2@example.com: Test message 2")).toBeInTheDocument();
	});

	test("updates input value when typing", () => {
		const { getByPlaceholderText } = render(
			<Router>
				<CommentComp commentHistory={mockCommentHistory} />
			</Router>
		);
		const input = getByPlaceholderText("Type your message...");
		fireEvent.change(input, { target: { value: "Test message 3" } });
		expect(input.value).toBe("Test message 3");
	});

	test("clears input value when Send button is clicked", () => {
		const { getByPlaceholderText, getByText } = render(
			<Router>
				<CommentComp commentHistory={mockCommentHistory} />
			</Router>
		);
		const input = getByPlaceholderText("Type your message...");
		fireEvent.change(input, { target: { value: "Test message 3" } });
		fireEvent.click(getByText("Send"));
		expect(input.value).toBe("Test message 3");
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});
});
