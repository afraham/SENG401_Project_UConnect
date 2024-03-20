import React, { useState, useEffect } from "react";
import "./MyEvents.css";
import "./FindEvents.css";
import AddEvents from "./AddEvents";
import { auth } from "../firebase";

function MyEvents() {
	// State to manage if the popup is shown or not
	const [showPopup, setShowPopup] = useState(false);

	const [events, setEvents] = useState([]);
	const [pendingEvents, setPendingEvents] = useState([]);

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

	const fetchPendingEvents = async () => {
		try {
			const user = auth.currentUser;
			const userEmail = user ? user.email : null;

			if (userEmail) {
				console.log(userEmail)
				const response = await fetch(
					`http://localhost:8000/api/pendingEventsByEmail?userEmail=${userEmail}`
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
				setPendingEvents(eventsWithExpansion); // Assuming data is an array of events
				console.log("Fetched successfully")
			}
		} catch (error) {
			console.error("Error fetching events:", error);
		}
	};

	useEffect(() => {
		fetchEvents();
		fetchPendingEvents();
	}, []);


	const toggleExpansion = (index) => {
        setEvents(currentEvents =>
            currentEvents.map((event, i) => {
                if (i === index) {
                    return { ...event, isExpanded: !event.isExpanded };
                }
                return event;
            })
        );
    };

	return (
		<div>
			<div className="my-events-page">
				<p><b>ADD AN EVENT!</b></p>
				<div className="event-button-container">
					<button className="event-button" onClick={handleShowPopup}>
						{" "}
						+{" "}
					</button>
				</div>
				{showPopup && <AddEvents closePopup={handleClosePopup} />}
				
			</div>
			<hr className="myevents-line"></hr>
			<div className="event-list">
				{Array.isArray(events) &&
					events.map((event, index) => (
						<div
                            className={`event-card ${event.isExpanded ? 'expanded' : ''}`}
                            key={index}
                            onClick={() => toggleExpansion(index)}
                        >
							<div className="top-box">
								<div className="left-align">
									<p className="event-title">{event.title}</p>
								</div>
								<div className="right-align">
									<p className="capacity">
										{event.spotsTaken}/{event.maxPeople}
										
									</p>
									<p className="capacity"><i class="fa fa-group"></i></p>
								</div>
							</div>
							<p className={`description ${event.isExpanded ? 'expanded' : ''}`}>{event.description}</p>
							<div className="bottom-box">
								<div className="left-align">
									<p className="location"><i class="fa fa-map-marker"></i> {event.location}</p>
								</div>
								<div className="right-align">
									<button className="request-button">Edit</button>
								</div>
							</div>
						</div>
					))}
			</div>
			<div>
				{Array.isArray(pendingEvents) &&
					pendingEvents.map((event, index) => (
					<h1>
						{event.title}
					</h1>
					))}
			</div>
		</div>
	);
}

export default MyEvents;
