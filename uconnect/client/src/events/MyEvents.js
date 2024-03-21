import React, { useState, useEffect } from "react";
import "./MyEvents.css";
import "./FindEvents.css";
import AddEvents from "./AddEvents";
import ManageEvents from "./ManageEvents";
import { auth } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

function MyEvents() {
  // State to manage if the popup is shown or not
  const [showPopup, setShowPopup] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showManagePopup, setShowManagePopup] = useState(false);
	const [pendingEvents, setPendingEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("myEvents"); // State to track active tab
  
  // Edit Event
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setShowPopup(true);
  };

  // Delete Event
  const handleDeleteEvent = async (event) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/events/${event._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove the deleted event from the events state
        setEvents((currentEvents) =>
          currentEvents.filter((e) => e._id !== event._id)
        );
        console.log("Event deleted successfully");
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Function to show the popup
  const handleShowPopup = (event = null) => {
    setCurrentEvent(event);
    setShowPopup(true);
  };

  // Function to hide the popup
  const handleClosePopup = () => {
    setCurrentEvent(null);
    setShowPopup(false);
  };

  const handlePendingButton = (event = null) => {
    console.log("Will implement later");
  };
  
  const handleLeaveButton = async (event) => {

    const user = auth.currentUser;
    const userEmail = user ? user.email : null;

    try {
      const response = await fetch(`http://localhost:8000/api/events/leave/${event._id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }) // Just pass userEmail directly
      });
      if (response.ok) {
        console.log("Successfully left event.")
        fetchJoinedEvents();
      } else {
        console.error('Request to deny failed:', response.status, response.statusText);
        // Handle error case here
      }
    } catch (error) {
        console.error('Error leaving event:', error);
        // Handle error case here
    }
  }

  const fetchPendingEvents = async () => {
    try {
      const user = auth.currentUser;
      const userEmail = user ? user.email : null;

      if (userEmail) {
        console.log(userEmail);
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
        console.log("Fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchJoinedEvents = async () => {
		try {
			const user = auth.currentUser;
			const userEmail = user ? user.email : null;

			if (userEmail) {
				const response = await fetch(
					`http://localhost:8000/api/joinedEventsByEmail?userEmail=${userEmail}`
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
				setJoinedEvents(eventsWithExpansion); // Assuming data is an array of events
				console.log("Fetched joined successfully")
			}
		} catch (error) {
      setJoinedEvents([]);
			console.error("Error fetching joined events:", error);
		}
	};

  const handleManageEvent = (event) => {
    setCurrentEvent(event);
    setShowManagePopup(true); // Show manage popup when "Manage" button is clicked
    console.log("showManagePopup set to true:");
    console.log("showManagePopup set to true:", showManagePopup);
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
    fetchPendingEvents();
    fetchJoinedEvents();
  }, []);

  useEffect(() => {
    console.log("showManagePopup set to true:", showManagePopup);
  }, [showManagePopup]);

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

  return (
    <div>
      <div className="my-events-page">
        <p>
          <b>ADD AN EVENT!</b>
        </p>
        <div className="event-button-container">
          <button
            className="event-button"
            onClick={() => handleShowPopup(null)}
          >
            {" "}
            +{" "}
          </button>
        </div>
        {showPopup && (
          <AddEvents
            closePopup={handleClosePopup}
            event={currentEvent}
            editMode={Boolean(currentEvent)}
            updateEvents={fetchEvents}
          />
        )}
      </div>
      <hr className="myevents-line"></hr>
      <div className="event-tab">
        <button
          className={activeTab === "myEvents" ? "active-tab" : ""}
          onClick={() => setActiveTab("myEvents")}
        >
          My Events
        </button>
        <button
          className={activeTab === "pending" ? "active-tab" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={activeTab === "joined" ? "active-tab" : ""}
          onClick={() => setActiveTab("joined")}
        >
          Joined
        </button>
      </div>
      <div className="myevent-list">
        {activeTab === "myEvents" && // Only render if activeTab is "My Events"
          Array.isArray(events) &&
          events.map((event, index) => (
            <div
              className={`event-card ${event.isExpanded ? "expanded" : ""}`}
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
                  <p className="capacity">
                    <i class="fa fa-group"></i>
                  </p>

                  <button
                    className="manage-button"
                    onClick={() => handleManageEvent(event)}
                  >
                    Manage
                  </button>
                </div>
              </div>
              <p
                className={`description ${event.isExpanded ? "expanded" : ""}`}
              >
                {event.description}
              </p>
              <div className="bottom-box">
                <div className="left-align">
                  <p className="location">
                    <i class="fa fa-map-marker"></i> {event.location}
                  </p>
                </div>
                <div className="right-align">
                  <button
                    className="edit-button"
                    onClick={() => handleEditEvent(event)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteEvent(event)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "pending" && // Only render if activeTab is "Pending"
          Array.isArray(pendingEvents) &&
          pendingEvents.map((event, index) => (
            <div
              className={`event-card ${event.isExpanded ? "expanded" : ""}`}
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
                  <p className="capacity">
                    <i class="fa fa-group"></i>
                  </p>
                </div>
              </div>
              <p
                className={`description ${event.isExpanded ? "expanded" : ""}`}
              >
                {event.description}
              </p>
              <div className="bottom-box">
                <div className="left-align">
                  <p className="location">
                    <i class="fa fa-map-marker"></i> {event.location}
                  </p>
                </div>
                <div className="right-align">
                  <button
                    className="pending-button"
                    onClick={() => handlePendingButton(event)}
                  >
                    PENDING
                  </button>
                </div>
              </div>
            </div>
          ))}

          {activeTab === "joined" && // Only render if activeTab is "Pending"
          Array.isArray(joinedEvents) &&
          joinedEvents.map((event, index) => (
            <div
              className={`event-card ${event.isExpanded ? "expanded" : ""}`}
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
                  <p className="capacity">
                    <i class="fa fa-group"></i>
                  </p>
                </div>
              </div>
              <p
                className={`description ${event.isExpanded ? "expanded" : ""}`}
              >
                {event.description}
              </p>
              <div className="bottom-box">
                <div className="left-align">
                  <p className="location">
                    <i class="fa fa-map-marker"></i> {event.location}
                  </p>
                </div>
                <div className="right-align">
                  <button
                    className="leave-button"
                    onClick={() => handleLeaveButton(event)}
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {showManagePopup && (
        <ManageEvents
          event={currentEvent}
          setCurrent = {setCurrentEvent}
          title={currentEvent.title} // Pass the title as a prop
          closePopup={() => setShowManagePopup(false)}
          refetchEvents={fetchEvents}
        />
      )}
    </div>
  );
}

export default MyEvents;
