import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component
import { faClock, faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import "./EventDetails.css";
import CommentComp from './CommentComp';
import default_picture from "../images/default_picture.jpg";
import no_reqs_dino from "../images/no-reqs-dino.png";

const EventDetails = () => {
   // Get the event ID from the URL parameter
  const { state } = useLocation(); // This will give you access to the state passed through navigate
  const event = state.event; // Extracting the event object from the state
  const [date, time] = event.date.split('T'); // Splitting the ISO date string to separate date and time

  const [profiles, setProfiles] = useState(event.approved)

  
  useEffect(() => {

    const fetchProfileFromEmail = async () => {
        try {
          const newHandledRequests = [];
          for (let i = 0; i < event.approved.length; i++) {
            const email = event.approved[i];
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
        } catch (error) {
          console.error("Error fetching data for requests:", error);
          // Handle error case here
        }
      }

    fetchProfileFromEmail();
    
  }, [event.approved])
  
  if (!event) {
    return <div>Loading event details...</div>;
  }
  
  //Rendering the Individual event page.
  return (
    <div className='event-details-container'>
    <div className="event-details-body">
        <div className="description-box">
            <h1 className='event-details-container-title'>{event.title}</h1>
            <p className="description-content">{event.description}</p>
            
            <div className="icon-text">
                <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
                
                {date}
            </div>
            <div className="icon-text">
                <FontAwesomeIcon icon={faClock} className="time-icon" />
                {time}
            </div>
            <div className="icon-text">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                {event.location}
            </div>
        </div>
        <div className="details-body">
            <div className="event-details-approved-users-box">
                <h1>MEMBER LIST</h1>
                {Array.isArray(profiles) && profiles.length > 0 ? (
                <div className="event-details-approved-list">
                    {profiles.map((user, index) => (
                    <div className="event-details-approved-user" key={index}>
                    {user.profileAvaiable ? (
                    <div className="event-details-profile">
                        <div className="event-details-pfp-box">
                            <img
                            src={user.picture}
                            alt="Profile"
                            className="event-details-avatar"
                            ></img>
                        </div>
                        <div className="event-details-user-info">
                            <h1 className="event-details-approved-name">{user.name}</h1>
                            <h10 className="event-details-approved-bio">{user.bio}</h10>
                            {Array.isArray(user.interests) && user.interests.length > 0 && (
                            <div className="event-details-approved-interests-box" key={index}>
                                {user.interests.map((interest, interestindex) => ( 
                                <div className="event-details-approved-interest">
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
                                className="event-details-avatar"
                            ></img>
                        </div>
                        <div className="event-details-user-info">
                            <h1 className="event-details-approved-name">{user.email}</h1>
                        </div>
                    </div>
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
                </div>
            <div className="chat-box">
                <CommentComp commentHistory={event.comments}/>
            </div>
        </div>
        </div>
    </div>
  );
}

export default EventDetails;