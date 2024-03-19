import React, { useState, useEffect } from "react";
import "./MyEvents.css";
import AddEvents from "./AddEvents";
import { auth } from "../firebase";

function MyEvents() {
	// State to manage if the popup is shown or not
	const [showPopup, setShowPopup] = useState(false);

	const [events, setEvents] = useState([]);

	// Function to show the popup
	const handleShowPopup = () => {
		setShowPopup(true);
	};

	// Function to hide the popup
	const handleClosePopup = () => {
		setShowPopup(false);
	};

	const fetchEvents = async () => {
		try {
			const user = auth.currentUser;
			const userEmail = user ? user.email : null;

			if (userEmail) {
				const response = await fetch(
					`http://localhost:8000/api/eventsByEmail?userEmail=${userEmail}`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				console.log(data); // Log the data
				const eventsWithExpansion = data.map((event) => ({
					...event,
					isExpanded: false,
				}));
				setEvents(eventsWithExpansion); // Assuming data is an array of events
			}
		} catch (error) {
			console.error("Error fetching events:", error);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	return (
		<div className="my-events-page">
			<p>
				<b>ADD AN EVENT!</b>
			</p>
			<div className="event-button-container">
				<button className="event-button" onClick={handleShowPopup}>
					{" "}
					+{" "}
				</button>
			</div>
			{showPopup && <AddEvents closePopup={handleClosePopup} />}
		</div>
	);
}

export default MyEvents;
