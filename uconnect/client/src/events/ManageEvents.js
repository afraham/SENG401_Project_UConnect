import React from "react";

const ManageEvents = ({ closePopup, event, title }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="ce-header">
          <h2 className="ce-header">Manage {title}</h2>
          <div className="requests">
            <h3>Requests</h3>
            <div className="request-list">
              <div className="request">
          
              </div>
    
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
