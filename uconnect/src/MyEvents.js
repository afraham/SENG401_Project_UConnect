import React from 'react';
import './MyEvents.css';


function MyEvents() {
  return (
    <div className="my-events-page">
      <p>ADD AN EVENT!</p>
      <div className="event-button-container">
        <button className="event-button" >
          +
        </button>
      </div>
    </div>
  );
}

export default MyEvents;
