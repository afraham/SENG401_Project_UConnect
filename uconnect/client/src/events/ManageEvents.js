import React, { useState } from "react";
import "./ManageEvents.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import default_picture from "../images/default_picture.jpg";
import no_reqs_dino from "../images/no-reqs-dino.png";

const ManageEvents = ({
  closePopup,
  event,
  title,
  setCurrent,
  refetchEvents,
}) => {
  const [handledRequests, setHandledRequests] = useState(
    new Array(event.pending.length).fill("unhandled")
  );

  /*
  handleClosePopup
  Handler for button press of ManageEvents popup close. 
  Closes the popup and refetches user's events to update event's capacity on view.

  Params: None
  Returns: None
  */

  const handleClosePopup = () => {
    refetchEvents(); // Refetches and updates MyEvent's events state
    closePopup(); // Close popup
  };


  /*
  handleApprove
  Handler for button press to approve user into event.
  Sends data to database to add user to approved list and removes user from pending list.
  Increases event capacity and updates the requests state to prevent host from updating user multiple times.

  Params: userEmail : String, index: int
  Returns: Updates requests state
  */

  const handleApprove = async (userEmail, index) => {
    if (event.spotsTaken >= event.maxPeople) {
      alert("Max amount of users Reached");
    } else {
      try {
        const response = await fetch(
          `http://localhost:8000/api/events/approve/${event._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail }), // Just pass userEmail directly
          }
        );

        if (response.ok) {
          setHandledRequests((prevReqs) => {
            const newReqs = [...prevReqs];
            newReqs[index] = "approved"; // Update the status of the item
            return newReqs;
          });
        } else {
          console.error(
            "Request to approve failed:",
            response.status,
            response.statusText
          );
          // Handle error case here
        }
      } catch (error) {
        console.error("Error approving user:", error);
        // Handle error case here
      }
    }
  };

    /*
  handleDeny
  Handler for button press to deny user into event.
  Sends data to database to remove user from pending list
  Does not increase event capacity, removes buttons to prevent further updates.

  Params: userEmail : String, index: int
  Returns: Updates requests state
  */

  const handleDeny = async (userEmail, index) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/events/deny/${event._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }), // Just pass userEmail directly
        }
      );
      if (response.ok) {
        setHandledRequests((prevReqs) => {
          const newReqs = [...prevReqs];
          newReqs[index] = "denied"; // Update the status of the item
          return newReqs;
        });
      } else {
        console.error(
          "Request to deny failed:",
          response.status,
          response.statusText
        );
        // Handle error case here
      }
    } catch (error) {
      console.error("Error denying user:", error);
      // Handle error case here
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="ce-header">
          <h2 className="ce-header">
            Manage <span className="formatted-title">{title}</span>
          </h2>
          <div className="requests">
            <h3>Requests</h3>
            {Array.isArray(event.pending) && event.pending.length > 0 ? (
              <div className="request-list">
                {event.pending.map((request, index) => (
                  <div className="request" key={index}>
                    <img
                      src={default_picture}
                      alt="Profile"
                      className="request-avatar"
                    ></img>
                    <p>{request}</p>
                    {handledRequests[index] === "unhandled" && (
                      <div className="buttons">
                        <button
                          className="approve-button"
                          onClick={() => handleApprove(request, index)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className="deny-button"
                          onClick={() => handleDeny(request, index)}
                        >
                          <FontAwesomeIcon icon={faX} />{" "}
                        </button>
                      </div>
                    )}
                    {handledRequests[index] === "denied" && (
                      <span className="request-outcome">DENIED</span>
                    )}
                    {handledRequests[index] === "approved" && (
                      <span className="request-outcome">ACCEPTED</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reqs">
                <img
                  className="no-reqs-img"
                  alt="no-reqs-dino"
                  src={no_reqs_dino}
                />
                <p>No requests right now, come back later!</p>
              </div>
            )}
            <button className="close-button" onClick={handleClosePopup}>
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
