import React, { useState } from "react";

const ManageEvents = ({ closePopup, event, title, setCurrent, refetchEvents }) => {

  const [handledRequests, setHandledRequests] = useState(event.pending.map(() => 'unhandled'))

  const handleClosePopup = () => {
    refetchEvents();
    closePopup();
  }
  const handleApprove = async (userEmail, index) => {

    if (event.spotsTaken >= event.maxPeople) {
      alert('Max amount of users Reached')
    }
    else {
      try {
        const response = await fetch(`http://localhost:8000/api/events/approve/${event._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail }) // Just pass userEmail directly
        });
  
        if (response.ok) {
          setHandledRequests(prevReqs => {
            const newReqs = [...prevReqs];
            newReqs[index] = 'approved'; // Update the status of the item
            return newReqs;
          });
        } else {
            console.error('Request to approve failed:', response.status, response.statusText);
            // Handle error case here
        }
      } catch (error) {
          console.error('Error approving user:', error);
          // Handle error case here
      }
    }
  }
  const handleDeny = async (userEmail, index) => {
    try {
      const response = await fetch(`http://localhost:8000/api/events/deny/${event._id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }) // Just pass userEmail directly
      });
      if (response.ok) {
        setHandledRequests(prevReqs => {
          const newReqs = [...prevReqs];
          newReqs[index] = 'denied'; // Update the status of the item
          return newReqs;
        });
      } else {
        console.error('Request to deny failed:', response.status, response.statusText);
        // Handle error case here
      }
    } catch (error) {
        console.error('Error denying user:', error);
        // Handle error case here
    }
  }

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="ce-header">
          <h2 className="ce-header">Manage {title}</h2>
          <div className="requests">
            <h3>Requests</h3>
            <div className="request-list">
              {Array.isArray(event.pending) && event.pending.map((request, index) =>
              <div className="request" key={index}>
                <h1>{request}</h1>
                {handledRequests[index] === 'unhandled' && (
                  <div>
                    <button onClick={() => handleApprove(request, index)}>Approve</button>
                    <button onClick={() => handleDeny(request, index)}>Deny</button>
                  </div>
                )}
                {handledRequests[index] === 'denied' && <span>Denied</span>}
                {handledRequests[index] === 'approved' && <span>Accepted</span>}
              </div>
              )}
            </div>

          </div>
          <button className="close-button" onClick={handleClosePopup}>
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;