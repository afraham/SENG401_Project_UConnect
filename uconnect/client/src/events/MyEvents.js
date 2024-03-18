import React, { useState } from "react";
import "./MyEvents.css";
import AddEvents from "./AddEvents";

function MyEvents() {
	// State to manage if the popup is shown or not
	const [showPopup, setShowPopup] = useState(false);

	// Function to show the popup
	const handleShowPopup = () => {
		setShowPopup(true);
	};

	// Function to hide the popup
	const handleClosePopup = () => {
		setShowPopup(false);
	};

	return (
		<div className="my-events-page">
			<p>ADD AN EVENT!</p>
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
