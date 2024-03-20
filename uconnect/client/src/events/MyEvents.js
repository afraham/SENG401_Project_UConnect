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

  // Edit Event
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setShowPopup(true);
  };

  // Delete Event
  const handleDeleteEvent = async (event) => {
    try {
        const response = await fetch(`http://localhost:8000/api/events/${event._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Remove the deleted event from the events state
            setEvents((currentEvents) =>
                currentEvents.filter((e) => e._id !== event._id)
            );
            console.log('Event deleted successfully');
        } else {
            console.error('Failed to delete event');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
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
      <div className="event-list">
        {Array.isArray(events) &&
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
      </div>
      {showManagePopup && (
        <ManageEvents
          event={currentEvent}
          title={currentEvent.title} // Pass the title as a prop
          closePopup={() => setShowManagePopup(false)}
        />
      )}
    </div>
  );
}

export default MyEvents;
