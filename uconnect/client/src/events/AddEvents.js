import React, { useState } from "react";
import "./AddEvents.css";
import { auth } from "../firebase";

const AddEvents = ({ closePopup, event, editMode, updateEvents }) => {
	const [title, setTitle] = useState(event ? event.title : "");
	const [description, setDescription] =  useState(event ? event.description : "");
	const [maxPeople, setMaxPeople] = useState(event ? event.maxPeople : 2);
	const [date, setDate] = useState(event ? event.date : "");
	const [location, setLocation] = useState(event ? event.location : "");
	const maxCharacters = 24;
	
	// Function to increment maxPeople
	const incrementPeople = () => {
		setMaxPeople((prev) => prev + 1);
	};

	// Function to decrement maxPeople
	const decrementPeople = () => {
		setMaxPeople((prev) => (prev > 2 ? prev - 1 : 2));
	};

	
	const handleInputChange = (value, setValue) => {
		if (value.length > maxCharacters) {
		  alert(`Please keep the input under ${maxCharacters} characters.`);
		} else {
		  setValue(value);
		}
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
			const comments = []

			const spotsTaken = 1;
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
					approved,
					comments
				}),
			});

			if (response.ok) {
				console.log("Event data sent successfully");
				updateEvents();
				closePopup();
			} else {
				console.error("Failed to send event data");
			}
		} catch (error) {
			console.error("Error sending event data:", error);
		}
	};
	//..................

	const handleUpdateEvent = async (eventId) => {
		try {
			if (
				!title.trim() ||
				!description.trim() ||
				!date.trim() ||
				!location.trim()
			) {
				alert("Please fill in all fields.");
				return; // Stop the function if any field is empty
			}
	
			const user = auth.currentUser; // get the current user
			const userEmail = user ? user.email : null; // get the user's email
	
			const updatedEventData = {
				title,
				description,
				maxPeople,
				date,
				location,
				userEmail, // Assuming userEmail is required for the update
			};
	
			const response = await fetch(`http://localhost:8000/api/events/${eventId}/edit`, {
				method: "PATCH", // Use PATCH method for partial updates
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedEventData),
			});
	
			if (response.ok) {
				console.log("Event data updated successfully");
				updateEvents();
				closePopup();
			} else {
				console.error("Failed to update event data desc:", response.status);
				console.error("Response data:", await response.json());
			}
		} catch (error) {
			console.error("Error updating event data:", error);
		}
	};
	
	return (
		<div className="popup-container">
			<div className="popup-content">
				<div className="ce-header">
					<h2 className="ce-header">{editMode ? "Edit Event" : "Add New Event"}</h2>
					<button className="close-button" onClick={closePopup}>
						X
					</button>
				</div>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => handleInputChange(e.target.value, setTitle)}
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
					<p>Max People: </p>
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
					<button className="create-button" onClick={editMode ? () => handleUpdateEvent(event._id) : saveEventData}>
						{editMode ? "Save Changes" : "Create"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddEvents;
