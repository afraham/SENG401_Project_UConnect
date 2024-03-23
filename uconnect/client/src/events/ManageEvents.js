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

  const handleClosePopup = () => {
    refetchEvents();
    closePopup();
  };
  const handleApprove = async (userEmail, index) => {
    if (event.spotsTaken >= event.maxPeople) {
      alert('Max amount of users Reached')
    }
    else {
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
                <img className="no-reqs-img" alt="no-reqs-dino" src={no_reqs_dino} />
                <p>No request right now, come back later!</p>
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
