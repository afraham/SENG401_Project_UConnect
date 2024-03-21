import { useState, useEffect } from "react";
import "./FindEvents.css";
import { auth } from "../firebase"; // Import Firebase auth

function FindEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Function to fetch events from API
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/events");
                const data = await response.json();
                console.log(data); // Log the data
                const eventsWithExpansion = data.map(event => ({
                    ...event,
                    isExpanded: false
                }));
                setEvents(eventsWithExpansion); // Assuming data is an array of events
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();

        // Set the user's email from Firebase Auth
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        }
    }, []); // Empty dependency array ensures the effect runs only once after initial render

    // State to store user's email
    const [userEmail, setUserEmail] = useState("");

    // Function to toggle event card expansion
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

    const handleRequestToJoin = async (eventId, userEmail, index) => {
        // Update the event's state to indicate that the request is pending
        setEvents(currentEvents =>
            currentEvents.map((event, i) => {
                if (i === index) {
                    return { ...event, isExpanded: event.isExpanded, requestStatus: 'Pending' };
                }
                return event;
            })
        );
        try {
            const response = await fetch(`http://localhost:8000/api/events/${eventId}/join`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail }) // Just pass userEmail directly
            });
    
            if (response.ok) {
                console.log('Request to join sent successfully');
            } else {
                console.error('Failed to send request to join:', response.status, response.statusText);
                // Handle error case here
            }
        } catch (error) {
            console.error('Error sending request to join:', error);
            // Handle error case here
        }
    };
	
    return (
        <div>
            <br /><br /><br /><br />
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
                                    <button
                                        className={`request-button ${event.requestStatus === 'Pending' ? 'pending' : ''}`}
                                        disabled={event.requestStatus === 'Pending'}
                                        onClick={() => handleRequestToJoin(event._id, userEmail, index)}
                                    >
                                        {event.requestStatus === 'Pending' ? 'Pending' : 'Request To Join'}
                                    </button>
                              
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default FindEvents;
