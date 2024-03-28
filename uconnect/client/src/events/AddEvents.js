import React, { useState } from "react";
import "./AddEvents.css";
import { auth } from "../firebase";

const AddEvents = ({ closePopup, event, editMode, updateEvents }) => {
	const [title, setTitle] = useState(event ? event.title : ""); // State for the event title, with a default value for a new event
	const [description, setDescription] = useState(
		event ? event.description : ""
	); // State for the event description
	const [maxPeople, setMaxPeople] = useState(event ? event.maxPeople : 2); // State for  max people, should start with 2 min
	const [date, setDate] = useState(event ? event.date : "");
	const [location, setLocation] = useState(event ? event.location : "");
	const [spotsTaken] = useState(event ? event.spotsTaken : 0);
	const maxCharacters = 24; // Only 24 Characters allowed for title

	// Format the current date and time to not allow passed dates
	const currentDateTime = new Date().toISOString().slice(0, 16);

	// Calculate maximum date (2 years from now)
	const maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() + 2);
	const maxDateTime = maxDate.toISOString().slice(0, 16);

	// Function to increment maxPeople
	const incrementPeople = () => {
		setMaxPeople((prev) => prev + 1);
	};

	// Function to decrement maxPeople
	const decrementPeople = () => {
		if (spotsTaken >= maxPeople) {
			alert(
				"Cannot reduce the number of spots available below the number of spots already taken."
			);
		} else {
			setMaxPeople((prev) => (prev > 2 ? prev - 1 : 2));
		}
	};

	/*
    handleInputChange
    A generic input change handler that updates state based on the input value. Enforces a maximum character limit.
    
    Params:
    - value: String, the current value of the input
    - setValue: Function, the state setter function for updating the state
    
    Returns: None but may trigger an alert if the maximum character limit is exceeded.
    */
	const handleInputChange = (value, setValue) => {
		if (value.length > maxCharacters) {
			alert(`Please keep the input under ${maxCharacters} characters.`);
		} else {
			setValue(value);
		}
	};

	/*
    saveEventData
    Saves new event data to the database. Checks for empty fields and alerts the user if any are found.
    Extracts the current user's email from auth and sends the event data using a POST request.
    
    Params: None
    Returns: None but updates the event list in the parent component and closes the popup on success.
    */
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

		// send the event data to the server
		try {
			const user = auth.currentUser; // get the current user
			const userEmail = user ? user.email : null; // get the user's email

			const pending = [];
			const approved = [];
			const comments = [];

			const spotsTaken = 1;
			const response = await fetch(
				"https://u-connect-server.vercel.app/api/events",
				{
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
						comments,
					}),
				}
			);

			// Checking the server's response
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

	/*
    handleUpdateEvent
    Updates existing event data in the database. Performs field checks similar to saveEventData,
    but sends a PATCH request to a specific event endpoint.
    
    Params:
    - eventId: String, the ID of the event to update
    
    Returns: None but updates the event list in the parent component and closes the popup on success.
    */
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
				userEmail,
			};

			// Sending the updated event data to the server using a PATCH request for partial update
			const response = await fetch(
				`https://u-connect-server.vercel.app/api/events/${eventId}/edit`,
				{
					method: "PATCH", // Use PATCH method for partial updates
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedEventData),
				}
			);

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

	// Rendering the Popup UI after clicking Add an Event.
	return (
		<div className="popup-container">
			<div className="popup-content">
				<div className="add-event-form">
					<div className="ce-header">
						<h2 className="ce-header">
							{editMode ? "Edit Event" : "Add New Event"}
						</h2>
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
						min={currentDateTime}
						max={maxDateTime}
					/>
					<input
						type="text"
						placeholder="Location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
					<div className="create-button-container">
						<button
							className="create-button"
							onClick={
								editMode ? () => handleUpdateEvent(event._id) : saveEventData
							}
						>
							{editMode ? "Save Changes" : "Create"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddEvents;
