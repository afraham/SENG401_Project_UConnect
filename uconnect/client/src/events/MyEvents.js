import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  // Edit Event
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setShowPopup(true);
  };

  //Individual event page
  const goToEventDetails = (event) => {
    navigate(`/user/events/${event._id}`, { state: { event } });
  };

  //
  const confirmDelete = (event) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete your event, ${event.title}?`
    );
    if (isConfirmed) {
      handleDeleteEvent(event);
    }
  };

   // Delete Event
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
        const eventsWithExpansion = data.map((event) => ({
          ...event,
          isExpanded: false,
        }));
        setJoinedEvents(eventsWithExpansion); // Assuming data is an array of events
        console.log("Fetched joined successfully");
      }
    } catch (error) {
      setJoinedEvents([]);
      console.error("Error fetching joined events:", error);
    }
  };

  const handleManageEvent = (event) => {
    setCurrentEvent(event);
    setShowManagePopup(true); // Show manage popup when "Manage" button is clicked
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
  // const updateEventMaxPeople = async (eventId, newMaxPeople) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/events/updateMaxPeople/${eventId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ maxPeople: newMaxPeople }),
  //     });

  //     if (response.ok) {
  //       console.log("Max people updated successfully");
  //       fetchEvents(); // Refetch events to update the UI
  //     } else {
  //       console.error("Failed to update max people");
  //     }
  //   } catch (error) {
  //     console.error("Error updating max people:", error);
  //   }
  // };

  // // New function to decrement the number of max people for an event
  // const decrementMaxPeople = (event) => {
  //   const { _id, spotsTaken, maxPeople } = event;
  //   if (maxPeople > spotsTaken) {
  //     const newMaxPeople = maxPeople - 1;
  //     updateEventMaxPeople(_id, newMaxPeople);
  //   } else {
  //     alert("Cannot decrease the number of max people because it would go below the number of participants already enrolled.");
  //   }
  // };
  

  // useEffect(() => {
  //   fetchEvents();
  //   fetchPendingEvents();
  //   fetchJoinedEvents();
  // }, []);

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
      <div className="myevent-list">
        {activeTab === "myEvents" && // Only render if activeTab is "My Events"
          Array.isArray(events) &&
          events.map((event, index) => (
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
                    {event.pending.length > 0 && <span onClick={() => handleManageEvent(event)} className="pending-requests-bubble">{event.pending.length}</span>}
                    </div>
                </div>
              </div>
              <p
                className={`description ${event.isExpanded ? "expanded" : ""}`}
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
          ))}

        {activeTab === "pending" && // Only render if activeTab is "Pending"
          Array.isArray(pendingEvents) &&
          pendingEvents.map((event, index) => (
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
                className={`description ${event.isExpanded ? "expanded" : ""}`}
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
                    CANCEL
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
          ))}
      </div>
      {showManagePopup && (
        <ManageEvents
          event={currentEvent}
          setCurrent={setCurrentEvent}
          title={currentEvent.title} // Pass the title as a prop
          closePopup={() => setShowManagePopup(false)}
          refetchEvents={fetchEvents}
        />
      )}
    </div>
  );
}

export default MyEvents;
