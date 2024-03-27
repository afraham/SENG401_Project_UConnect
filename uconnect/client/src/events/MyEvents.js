import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyEvents.css";
import "./FindEvents.css";
import AddEvents from "./AddEvents";
import ManageEvents from "./ManageEvents";
import { auth } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import no_reqs_dino from "../images/no-reqs-dino.png";

function MyEvents() {
  // State to manage if the popup is shown or not
  const [showPopup, setShowPopup] = useState(false);
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showManagePopup, setShowManagePopup] = useState(false);
  const [pendingEvents, setPendingEvents] = useState(() => {
    const savedPendingEvents = localStorage.getItem("pendingEvents");
    return savedPendingEvents ? JSON.parse(savedPendingEvents) : [];
  });
  const [joinedEvents, setJoinedEvents] = useState(() => {
    const savedJoinedEvents = localStorage.getItem("joinedEvents");
    return savedJoinedEvents ? JSON.parse(savedJoinedEvents) : [];
  });
  const [activeTab, setActiveTab] = useState("myEvents");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Save pendingEvents to localStorage when they change
  useEffect(() => {
    localStorage.setItem("pendingEvents", JSON.stringify(pendingEvents));
  }, [pendingEvents]);

  // Save joinedEvents to localStorage when they change
  useEffect(() => {
    localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents));
  }, [joinedEvents]);

  useEffect(() => {
    // Call your fetch functions here to update state if needed
    // Note: You might want to check if there's data in localStorage before fetching
    // to avoid unnecessary network requests
    fetchEvents();
    fetchPendingEvents();
    fetchJoinedEvents();
  }, []);

  /*
  handleEditEvent
  Prepares the selected event for editing by setting it as the current event and showing the popup form.
  
  Params:
    - event: Object, the event to edit
  
  Returns: None, but updates state to show the edit popup.
  */
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setShowPopup(true);
  };

  /*
  goToEventDetails
  Navigates to the detailed view of the selected event.
  
  Params:
    - event: Object, the event to view in detail
  
  Returns: None, but triggers navigation to the event details page.
  */
  const goToEventDetails = (event) => {
    navigate(`/user/events/${event._id}`, { state: { event } });
  };

  /*
  confirmDelete
  Asks for confirmation before deleting an event. Calls handleDeleteEvent if confirmed.
  
  Params:
    - event: Object, the event to potentially delete
  
  Returns: None, but may trigger event deletion.
  */
  const confirmDelete = (event) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete your event, ${event.title}?`
    );
    if (isConfirmed) {
      handleDeleteEvent(event);
    }
  };

  /*
  handleDeleteEvent
  Deletes the specified event from the database and updates the local state to reflect the change.
  
  Params:
    - event: Object, the event to delete
  
  Returns: None, but updates the events state to remove the deleted event.
  */
  const handleDeleteEvent = async (event) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/events/delete/${event._id}`,
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

  /*
  handleShowPopup
  Shows the popup form for adding a new event or editing an existing one.
  
  Params:
    - event: Object (optional), the event to edit, if any
  
  Returns: None, but updates state to show the popup.
  */
  const handleShowPopup = (event = null) => {
    setCurrentEvent(event);
    setShowPopup(true);
  };

  /*
  handleClosePopup
  Closes the popup form for adding or editing events.
  
  Params: None
  
  Returns: None, but updates state to hide the popup.
  */
  const handleClosePopup = () => {
    setCurrentEvent(null);
    setShowPopup(false);
  };

  /*
  handlePendingButton
  Handles the removal of a pending event from Myevents.
  
  Params:
    - eventId: String, the ID of the event to cancel the pending request for
  
  Returns: None, but updates the pending events state upon success.
  */
  const handlePendingButton = async (eventId) => {
    try {
      const user = auth.currentUser;
      const userEmail = user ? user.email : null;

      const response = await fetch(
        `http://localhost:8000/api/events/cancelPending/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }),
        }
      );

      console.log("this is the eventId:", eventId);
      console.log("this is the email:", JSON.stringify({ userEmail }));

      if (response.ok) {
        console.log("Successfully removed pending request.");
        fetchPendingEvents(); // Refetch pending events to update the UI
      } else {
        console.error(
          "Request to remove pending request failed:",
          response.status,
          response.statusText
        );
        // Handle error case here
      }
    } catch (error) {
      console.error("Error removing pending request:", error);
      // Handle error case here
    }
  };

  /*
  handleLeaveButton
  Handles the action of leaving a joined event.
  
  Params:
    - event: Object, the event to leave
  
  Returns: None, but updates the joined events state upon success.
  */
  const handleLeaveButton = async (event) => {
    try {
      const user = auth.currentUser;
      const userEmail = user ? user.email : null;

      const response = await fetch(
        `http://localhost:8000/api/events/leave/${event._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }), // Just pass userEmail directly
        }
      );
      if (response.ok) {
        console.log("Successfully left event.");
        fetchJoinedEvents();
      } else {
        console.error(
          "Request to deny failed:",
          response.status,
          response.statusText
        );
        // Handle error case here
      }
    } catch (error) {
      console.error("Error leaving event:", error);
      // Handle error case here
    }
  };

  /*
  fetchPendingEvents
  Fetches the list of events the user has pending requests to join.
  
  Params: None
  
  Returns: None, but updates the pendingEvents state with the fetched data.
  */
  const fetchPendingEvents = async () => {
    try {
      const user = auth.currentUser;
      const userEmail = user ? user.email : null;

      if (userEmail) {
        const response = await fetch(
          `http://localhost:8000/api/pendingEventsByEmail?userEmail=${userEmail}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const eventsWithExpansion = data.map((event) => ({
          ...event,
          isExpanded: false,
        }));
        setPendingEvents(eventsWithExpansion);
        console.log("Fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  /*
  fetchJoinedEvents
  Fetches the list of events the user has joined.
  
  Params: None
  
  Returns: None, but updates the joinedEvents state with the fetched data.
  */
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
        const eventsWithExpansion = data.map((event) => ({
          ...event,
          isExpanded: false,
        }));
        setJoinedEvents(eventsWithExpansion);
        console.log("Fetched joined successfully");
      }
    } catch (error) {
      setJoinedEvents([]);
      console.error("Error fetching joined events:", error);
    }
  };

  /*
  handleManageEvent
  Prepares the selected event for management by showing the manage popup.
  
  Params:
    - event: Object, the event to manage
  
  Returns: None, but updates state to show the manage popup.
  */
  const handleManageEvent = (event) => {
    setCurrentEvent(event);
    setShowManagePopup(true); // Show manage popup when "Manage" button is clicked
  };

  /*
  fetchEvents
  Fetches the list of events created by the user.
  
  Params: None
  
  Returns: None, but updates the events state with the fetched data.
  */
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
        const eventsWithExpansion = data.map((event) => ({
          ...event,
          isExpanded: false,
        }));
        setEvents(eventsWithExpansion);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    //remove?
    fetchEvents();
    fetchPendingEvents();
    fetchJoinedEvents();
  }, []);

  //Rendering Myevents page
  return (
    <div>
      {/* Add Event Button */}
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
      {/* Switching the tabs between MyEvents, Pending and Joined*/}
      <hr className="myevents-line"></hr>
      <div className="event-tab">
        <button
          className={activeTab === "myEvents" ? "active-tab" : ""}
          onClick={() => setActiveTab("myEvents")}
        >
          My Events ({events.length})
        </button>
        <button
          className={activeTab === "pending" ? "active-tab" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pendingEvents.length})
        </button>
        <button
          className={activeTab === "joined" ? "active-tab" : ""}
          onClick={() => setActiveTab("joined")}
        >
          Joined ({joinedEvents.length})
        </button>
      </div>
      {/* render if activeTab is "My Events" */}
      <div className="myevent-list">
        {activeTab === "myEvents" && Array.isArray(events) && events.length > 0
          ? events.map((event, index) => (
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

                    <div className="manage-button-container">
                      <button
                        className="manage-button"
                        onClick={() => handleManageEvent(event)}
                      >
                        <i class="fa fa-user-plus"></i>
                      </button>
                      {event.pending.length > 0 && (
                        <span
                          onClick={() => handleManageEvent(event)}
                          className="pending-requests-bubble"
                        >
                          {event.pending.length}
                        </span>
                      )}
                    </div>
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
                      className="edit-button"
                      onClick={() => handleEditEvent(event)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => confirmDelete(event)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          : activeTab === "myEvents" && (
              <p className="empty-events-message">
                You have not created any events yet. Click the "+" button above
                to create your first event!
              </p>
            )}

        {/* render if activeTab is "Pending" */}
        {activeTab === "pending" &&
        Array.isArray(pendingEvents) &&
        pendingEvents.length > 0
          ? pendingEvents.map((event, index) => (
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
                      className="pending-button"
                      onClick={() => handlePendingButton(event._id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          : activeTab === "pending" && (
              <p className="empty-events-message">
                You have no pending requests to join events.
              </p>
            )}

        {/* render if activeTab is "Joined" */}
        {activeTab === "joined" &&
        Array.isArray(joinedEvents) &&
        joinedEvents.length > 0
          ? joinedEvents.map((event, index) => (
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
                      className="leave-button"
                      onClick={() => handleLeaveButton(event)}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            ))
          : activeTab === "joined" && (
              <p className="empty-events-message">
                You have not joined any events yet. Click the "Find Events" tab
                above to find events to join!
              </p>
            )}
      </div>
      {showManagePopup && (
        <ManageEvents
          event={currentEvent}
          setCurrent={setCurrentEvent}
          title={currentEvent.title}
          closePopup={() => setShowManagePopup(false)}
          refetchEvents={fetchEvents}
        />
      )}
    </div>
  );
}

export default MyEvents;