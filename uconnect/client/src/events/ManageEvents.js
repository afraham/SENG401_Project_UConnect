import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (event && event.pending) {
      setHandledRequests(new Array(event.pending.length).fill("unhandled"));
    }
  }, [event]);

  const [profiles, setProfiles] = useState([])
  const [selectedTab, setSelectedTab] = useState("pending");
  const [kickedUsers, setKickedUsers] = useState([]);

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

  // Kicking out approved users
  const handleKick = async (userEmail) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/events/kick/${event._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail }),
        }
      );
      if (response.ok) {
        setKickedUsers((prevKickedUsers) => [...prevKickedUsers, userEmail]);
        refetchEvents();
      } else {
        console.error(
          "Request to kick failed:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error kicking user:", error);
    }
  };


  const fetchProfileFromEmail = async () => {
    try {
      const newHandledRequests = [];
      for (let i = 0; i < event.pending.length; i++) {
        const email = event.pending[i];
        try {
          // Attempt to fetch user data from the database using request
          const response = await fetch(`http://localhost:8000/api/profiles/${email}`);
          if (response.ok) {
            const userData = await response.json();
            newHandledRequests.push({
              name: userData.name,
              picture: userData.picture,
              interests: userData.interests,
              bio: userData.bio,
              email: email,
              profileAvaiable: true
            });
          } else {
            console.log("Could not find matching profile, this might not be an error!")
            // If user data not found, use request itself
            newHandledRequests.push({
              email: email,
              picture: default_picture,
              profileAvaiable: false
            });
          }
        } catch (error) {
          console.error("Error fetching user data for request:", error);
          // If an error occurs, use request itself
          newHandledRequests.push({
            name: email,
            picture: default_picture,
            profileAvaiable: false
          });
        }
      }
      setProfiles(newHandledRequests);
      console.log("Profiles:", newHandledRequests); // Print out the profiles
    } catch (error) {
      console.error("Error fetching data for requests:", error);
      // Handle error case here
    }
  }

  useEffect(() => {
    fetchProfileFromEmail();
  }, [])

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="ce-header">
          <h2 className="ce-header">
            Manage <span className="formatted-title">{title}</span>
          </h2>
          <div className="requests">
            <div className="tab-buttons">
              <button
                className={selectedTab === "pending" ? "active" : ""}
                onClick={() => setSelectedTab("pending")}
              >
                Requests
              </button>
              <button
                className={selectedTab === "approved" ? "active" : ""}
                onClick={() => {
                  console.log("Approved array:", event.approved);
                  setSelectedTab("approved");
                }}
              >
                Approved
              </button>
            </div>
            {selectedTab === "pending" && (
              <>
                {Array.isArray(profiles) && profiles.length > 0 ? (
                  <div className="request-list">
                    {profiles.map((request, index) => (
                      <div className="request" key={index}>
                        {request.profileAvaiable ? (
                          <div className="profile">
                            <div className="pfp-box">
                              <img
                                src={request.picture}
                                alt="Profile"
                                className="request-avatar"
                              ></img>
                            </div>
                            <div className="user-info">
                              <h1 className="request-name">{request.name}</h1>
                              <h10 className="request-bio">{request.bio}</h10>
                              {Array.isArray(request.interests) && request.interests.length > 0 && (
                                <div className="interests-box" key={index}>
                                  {request.interests.map((interest, interestindex) => (
                                    <div className="interest" key={interestindex}>
                                      <h10>{interest}</h10>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="profile">
                            <div className="pfp-box">
                              <img
                                src={default_picture}
                                alt="Profile"
                                className="request-avatar"
                              ></img>
                            </div>
                            <div className="user-info">
                              <h1 className="request-name">{request.email}</h1>
                            </div>
                          </div>
                        )}
                        {handledRequests[index] === "unhandled" && (
                          <div className="buttons">
                            <button
                              className="approve-button"
                              onClick={() => handleApprove(request.email, index)}
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button
                              className="deny-button"
                              onClick={() => handleDeny(request.email, index)}
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
              </>
            )}
            {selectedTab === "approved" && (
              <>
              {event.approved.length > 0 ? (
                <div className="request-list">
                  {event.approved.map((email, index) => {
                    const request = profiles.find((profile) => profile.email === email);
                    return (
                      <div className="request" key={index}>
                        {request && request.profileAvaiable ? (
                          <div className="profile">
                            <div className="pfp-box">
                              <img
                                src={request.picture}
                                alt="Profile"
                                className="request-avatar"
                              ></img>
                            </div>
                            <div className="user-info">
                              <h1 className="request-name">{request.name}</h1>
                              <h10 className="request-bio">{request.bio}</h10>
                              {Array.isArray(request.interests) && request.interests.length > 0 && (
                                <div className="interests-box" key={index}>
                                  {request.interests.map((interest, interestindex) => (
                                    <div className="interest" key={interestindex}>
                                      <h10>{interest}</h10>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="profile">
                            <div className="pfp-box">
                              <img
                                src={default_picture}
                                alt="Profile"
                                className="request-avatar"
                              ></img>
                            </div>
                            <div className="user-info">
                              <h1 className="request-name">{email}</h1>
                            </div>
                          </div>
                        )}
                        <div className={`request ${handledRequests[index] === "kicked" ? "kicked-user" : ""}`} key={index}>
                          {/* User content */}
                          <button
                            className="kick-button"
                            onClick={() => handleKick(email)}
                            disabled={kickedUsers.includes(email)} // Disable button if user has been kicked
                          >
                            {kickedUsers.includes(email) ? "KICKED" : "Kick 'Em"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-reqs">
                  <img
                    className="no-reqs-img"
                    alt="no-reqs-dino"
                    src={no_reqs_dino}
                  />
                  <p>No approved requests yet.</p>
                </div>
              )}
              </>
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