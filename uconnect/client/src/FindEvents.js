import { useState, useEffect } from "react";
import "./FindEvents.css";

function FindEvents() {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		// Function to fetch events from API
		const fetchEvents = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/events");
				const data = await response.json();
				console.log(data); // Log the data
				setEvents(data); // Assuming data is an array of events
			} catch (error) {
				console.error("Error fetching events:", error);
			}
		};

		fetchEvents();
	}, []); // Empty dependency array ensures the effect runs only once after initial render

	return (
		<div>
			<h1>Event List</h1>
			<div className="event-list">
				{Array.isArray(events) &&
					events.map((event, index) => (
						<div className="event-card" key={index}>
							<div className="top-box">
								<div className="left-align">
									<p className="event-title">{event.title}</p>
								</div>
								<div className="right-align">
									<p className="capacity">
										{event.spotsTaken}/{event.maxPeople}
									</p>
									<p>&#128100;</p>
								</div>
							</div>
							<p className="description">{event.description}</p>
							<div className="bottom-box">
								<div className="left-align">
									<p className="location">{event.location}</p>
								</div>
								<div className="right-align">
									<button className="request-button">Request To Join</button>
								</div>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}

export default FindEvents;
