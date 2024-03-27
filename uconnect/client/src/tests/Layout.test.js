import { render, fireEvent } from "@testing-library/react";
import Layout from "../layouts/Layout.js";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => jest.fn(),
}));

describe("Layout", () => {
	test("renders without crashing", () => {
		render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>
		);
	});

	test("displays logo", () => {
		const { getByAltText } = render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>
		);
		const logoElement = getByAltText("Logo");
		expect(logoElement).toBeInTheDocument();
	});

	test("displays navigation links", () => {
		const { getByText } = render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>
		);
		expect(getByText("My Profile")).toBeInTheDocument();
		expect(getByText("My Events")).toBeInTheDocument();
		expect(getByText("Find Events")).toBeInTheDocument();
	});

	test("navigation links point to correct routes", () => {
		const { getByText } = render(
			<MemoryRouter>
				<Layout />
			</MemoryRouter>
		);
		expect(getByText("My Profile").closest("a")).toHaveAttribute(
			"href",
			"/user/myprofile"
		);
		expect(getByText("My Events").closest("a")).toHaveAttribute(
			"href",
			"/user/myevents"
		);
		expect(getByText("Find Events").closest("a")).toHaveAttribute(
			"href",
			"/user"
		);
	});
});
