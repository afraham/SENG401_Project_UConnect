import React from "react";

const ManageEvents = ({ closePopup, event, title}) => {


  const handleApprove = async (userEmail) => {

    if (event.spotsTaken >= event.maxPeople) {
      console.log("Max amount of users already in event, please add more spots if you would like to accept more users.") // Perhaps add a display to user to indicate this?
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
            console.log('Request Approved');
  
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
  const handleDeny = async (userEmail) => {
    try {
      const response = await fetch(`http://localhost:8000/api/events/deny/${event._id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }) // Just pass userEmail directly
      });

      if (response.ok) {
          console.log('User denied');

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
              <div className="request">
                <h1>{request}</h1>
                <button onClick={() => handleApprove(request)}>Approve</button>
                <button onClick={() => handleDeny(request)}>Deny</button>
              </div>
              )}
            </div>

          </div>
          <button className="close-button" onClick={closePopup}>
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
