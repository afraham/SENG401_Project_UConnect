import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindEvents.css";
import { auth } from "../firebase"; // Import Firebase auth

function FindEvents() {
  const [events, setEvents] = useState([]); // Array of all events retrieved from backend. All non-enrolled events.
  const [userEmail, setUserEmail] = useState(""); // State to store user's email
  const [searchQuery, setSearchQuery] = useState(""); // Search criteria by user
  const navigate = useNavigate();


  /*
  fetchEvents
  Function to fetch from database, fetches all events except those created by the user and/or joined/requested to join by the user.

  Params: None
  Returns: None but updates events state to the list of events user is not enrolled in.
  */

  const fetchEvents = async () => {
    const user = auth.currentUser;
    if (!user) return; // Early return if user is not authenticated
    const userEmail = user.email; // Get user email from authenticated user

    try {
        const response = await fetch(
            `http://localhost:8000/api/events?userEmail=${userEmail}` // API call to backend
        );
        if (response.ok) {
            const data = await response.json();

            console.log(data); // Log the data received from the API

            const eventsWithExpansionAndStatus = data.map((event) => {
              let buttonDisplay = "Request To Join";

              if (event.userEmail === userEmail) {
                buttonDisplay = "Your Event";
              }
              else if (Array.isArray(event.pending) && event.maxPeople === event.spotsTaken && event.pending.includes(userEmail)) {
                buttonDisplay = "Waitlisted";
              } 
              else if (Array.isArray(event.pending) && event.pending.includes(userEmail)) {
                  buttonDisplay = "Pending";
              } 
              else if (Array.isArray(event.approved) && event.approved.includes(userEmail)) {
                  buttonDisplay = "Joined";
              } 
              else if (event.maxPeople === event.spotsTaken) {
                  buttonDisplay = "Add to Waitlist";
              } 
          
              return {
                  ...event,
                  isExpanded: false,
                  buttonDisplay: buttonDisplay,
              };
            });
          
      
            setEvents(eventsWithExpansionAndStatus); // Set events state to the returned events
            localStorage.setItem(
                "events",
                JSON.stringify(eventsWithExpansionAndStatus)
            ); // Use local storage to store the events, storage is persistent
        } else {
            console.error("Failed to fetch events:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching events:", error);
    }
};

  // Effect to fetch events when the userEmail state changes, in theory userEmail should never change.
  useEffect(() => {
    fetchEvents();
  }, [userEmail]);

  // Effect to manage auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail("");
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from auth state changes
  }, []);

  // Handler for navigating to event details
  const goToEventDetails = (event) => {
    navigate(`/user/events/${event._id}`, { state: { event } });
  };

  /*
  handleRequestToJoin
  Handler for sending a request to join an event. Updates the event in the database
  and updates the view telling the user that their request is pending.

  Params: eventId : String, userEmail : String, index : int
  Returns: None, Updated set of events
  */
  const handleRequestToJoin = async (eventId, userEmail, index) => {
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
        fetchEvents();
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
        (searchQuery.trim() === "" || // Only filter if searchQuery is not empty
          events.filter((event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase())
          ).length > 0) ? (
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
                      event.buttonDisplay === "Pending" ? "pending" :
                      event.buttonDisplay === "Joined" ? "joined" :
                      event.buttonDisplay === "Add to Waitlist" ? "waitlist" :
                      event.buttonDisplay === "Waitlisted" ? "waitlisted" :
                      event.buttonDisplay === "Your Event" ? "yourevent" : ""
                    }`}
                    disabled={event.buttonDisplay === "Pending" || 
                    event.buttonDisplay === "Joined" ||
                    event.buttonDisplay === "Waitlisted" ||
                    event.buttonDisplay === "Your Event"
                  } //Disables button
                    onClick={() => handleRequestToJoin(event._id, userEmail, index)}
                  >
                    {/* // Displays the correct text of the button based on its state */}
                    {event.buttonDisplay === "Pending" && "Pending"} 
                    {event.buttonDisplay === "Joined" && "Joined"}
                    {event.buttonDisplay === "Add to Waitlist" && "Add to Waitlist"}
                    {event.buttonDisplay === "Request To Join" && "Request To Join"}
                    {event.buttonDisplay === "Waitlisted" && "Waitlisted"}
                    {event.buttonDisplay === "Your Event" && "Your Event!"}
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
