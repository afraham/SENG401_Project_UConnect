import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindEvents.css";
import { auth } from "../firebase"; // Import Firebase auth

function FindEvents() {
	const [events, setEvents] = useState([]);
	const [userEmail, setUserEmail] = useState(""); // State to store user's email
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchEvents = async () => {
			let eventsFromStorage = JSON.parse(localStorage.getItem("events"));
			const user = auth.currentUser;
			const userEmail = user ? user.email : null;

			try {
				const response = await fetch(
					`http://localhost:8000/api/events?userEmail=${userEmail}`
				);
				if (response.ok) {
					const data = await response.json();
					const eventsWithExpansionAndStatus = data.map((event) => {
						const storedEvent = eventsFromStorage?.find(
							(e) => e._id === event._id
						);
						return {
							...event,
							isExpanded: false,
							requestStatus: storedEvent?.requestStatus || "NotRequested", // Use status from storage if available
						};
					});
					setEvents(eventsWithExpansionAndStatus);
					localStorage.setItem(
						"events",
						JSON.stringify(eventsWithExpansionAndStatus)
					); // Update local storage with fresh data
				} else {
					console.error("Failed to fetch events:", response.statusText);

					if (eventsFromStorage) {
						setEvents(eventsFromStorage);
					}
				}
			} catch (error) {
				console.error("Error fetching events:", error);

				if (eventsFromStorage) {
					setEvents(eventsFromStorage);
				}
			}
		};

		fetchEvents();
	}, []);

	const goToEventDetails = (event) => {
		navigate(`/user/events/${event._id}`, { state: { event } });
	};

	const toggleExpansion = (index) => {
		setEvents((currentEvents) =>
			currentEvents.map((event, i) => {
				if (i === index) {
					return { ...event, isExpanded: !event.isExpanded };
				}
				return event;
			})
		);
	};

	const handleRequestToJoin = async (eventId, userEmail, index) => {
		const updatedEvents = events.map((event, i) => {
			if (i === index) {
				return {
					...event,
					isExpanded: event.isExpanded,
					requestStatus: "Pending",
				};
			}
			return event;
		});

		setEvents(updatedEvents);

		localStorage.setItem("events", JSON.stringify(updatedEvents));

		try {
			const response = await fetch(
				`http://localhost:8000/api/events/${eventId}/join`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userEmail }),
				}
			);

			if (response.ok) {
				console.log("Request to join sent successfully");
			} else {
				console.error(
					"Failed to send request to join:",
					response.status,
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error sending request to join:", error);
		}
	};

	return (
		<div>
			<br />
			<br />
			<br />
			<br />
			<div className="search-bar">
				<input
					type="text"
					placeholder="Search events..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			<div className="event-list">
				{Array.isArray(events) &&
				events.filter((event) =>
					event.title.toLowerCase().includes(searchQuery.toLowerCase())
				).length > 0 ? (
					events
						.filter((event) =>
							event.title.toLowerCase().includes(searchQuery.toLowerCase())
						)
						.map((event, index) => (
							<div
								className={`event-card ${event.isExpanded ? "expanded" : ""}`}
								key={index}
							>
								<div className="top-box">
									<div className="left-align">
										<p className="event-title">{event.title}</p>
									</div>
									<div className="right-align">
										<p className="capacity">
											{event.spotsTaken}/{event.maxPeople}
										</p>
										<p className="capacity">
											<i class="fa fa-group"></i>
										</p>
									</div>
								</div>
								<p
									className={`description ${
										event.isExpanded ? "expanded" : ""
									}`}
									onClick={() => goToEventDetails(event)}
								>
									{event.description}
								</p>
								<div className="bottom-box">
									<div className="left-align">
										<p className="location">
											<i class="fa fa-clock-o"></i> {event.date.split("T")[0]}
										</p>
									</div>
									<div className="right-align">
										<button
											className={`request-button ${
												event.requestStatus === "Pending" ? "pending" : ""
											}`}
											disabled={event.requestStatus === "Pending"}
											onClick={() =>
												handleRequestToJoin(event._id, userEmail, index)
											}
										>
											{event.requestStatus === "Pending"
												? "Pending"
												: "Request To Join"}
										</button>
									</div>
								</div>
							</div>
						))
				) : (
					<div className="no-events-message">
						No events match "{searchQuery}"
					</div>
				)}
			</div>
		</div>
	);
}

export default FindEvents;
