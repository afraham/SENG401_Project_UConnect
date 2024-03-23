import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component
import { faClock, faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import "./EventDetails.css";
import CommentComp from './CommentComp';

const EventDetails = () => {
   // Get the event ID from the URL parameter
  const { state } = useLocation(); // This will give you access to the state passed through navigate
  const [event, setSelectedEvent] = useState(state.event)
  const [date, time] = event.date.split('T');

  if (!event) {
    return <div>Loading event details...</div>;
  }
  
  return (
    <div>
        <div className='event-details-container'>
            <h1>{event.title}</h1>
            
            <div className="description-box">
                <p className="description-title">Description</p>
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
                <div>
                    <CommentComp commentHistory={event.comments}/>
                </div>
            </div>
        </div>
    </div>
  );
}

export default EventDetails;
