import React, { useState } from "react";
import "./AddEvents.css";
import { auth } from "../firebase";

const AddEvents = ({ closePopup }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [maxPeople, setMaxPeople] = useState(2);
	const [date, setDate] = useState("");
	const [location, setLocation] = useState("");

	// Function to increment maxPeople
	const incrementPeople = () => {
		setMaxPeople((prev) => prev + 1);
	};

	// Function to decrement maxPeople
	const decrementPeople = () => {
		setMaxPeople((prev) => (prev > 2 ? prev - 1 : 2));
	};

	const saveEventData = async () => {
		if (
			!title.trim() ||
			!description.trim() ||
			!date.trim() ||
			!location.trim()
		) {
			alert("Please fill in all fields.");
			return; // Stop the function if any field is empty
		}

		console.log({
			title,
			description,
			maxPeople,
			date,
			location,
		});

		closePopup();

		try {
			const user = auth.currentUser; // get the current user
			const userEmail = user ? user.email : null; // get the user's email

			const pending = []
			const approved = []

			const spotsTaken = 0;
			const response = await fetch("http://localhost:8000/api/events", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					description,
					maxPeople,
					spotsTaken,
					date,
					location,
					userEmail,
					pending,
					approved
				}),
			});

			if (response.ok) {
				console.log("Event data sent successfully");
				closePopup();
			} else {
				console.error("Failed to send event data");
			}
		} catch (error) {
			console.error("Error sending event data:", error);
		}
	};
	//..................

	return (
		<div className="popup-container">
			<div className="popup-content">
				<div className="ce-header">
					<h2 className="ce-header">Add New Event</h2>
					<button className="close-button" onClick={closePopup}>
						X
					</button>
				</div>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>{" "}
				{/*Title Box*/}
				<textarea
					placeholder="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>{" "}
				{/* Descr Box*/}
				<div className="max-people">
					{" "}
					{/*No. of People*/}
					<button onClick={decrementPeople}>-</button>
					<span>{maxPeople}</span>
					<button onClick={incrementPeople}>+</button>
				</div>
				<input
					type="datetime-local"
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Location"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>
				<div className="create-button-container">
					<button className="create-button" onClick={saveEventData}>
						Create
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddEvents;
