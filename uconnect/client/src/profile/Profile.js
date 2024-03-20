import React, { useState } from "react";
import "./Profile.css";
import default_picture from "../images/default_picture.jpg";
import { auth } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faX } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: "Firstname Lastname",
    email: auth.currentUser ? auth.currentUser.email : "email@example.com",
    bio: "",
    interests: [],
    picture: null,
  });
  const [newInterest, setNewInterest] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = (updatedInfo) => {
    setProfileInfo(updatedInfo);
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    setProfileInfo({
      ...profileInfo,
      picture: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleAddInterest = () => {
    if (newInterest && !profileInfo.interests.includes(newInterest)) {
      setProfileInfo({
        ...profileInfo,
        interests: [...profileInfo.interests, newInterest],
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest) => {
    setProfileInfo({
      ...profileInfo,
      interests: profileInfo.interests.filter((i) => i !== interest),
    });
  };

  return (
    <>
      <div className="myprofile-container">
        {/* Profile Info */}
        <div className="profile-info">
          <div className="profile-header">
            {/* Avatar */}
            {!isEditing ? (
              <img
                src={profileInfo.picture || default_picture}
                alt="Profile"
                className="avatar"
              />
            ) : (
              <input type="file" onChange={handleImageUpload} />
            )}

            <div className="profile-name-email">
              {/* Name */}
              {!isEditing ? (
                <div className="displayName">{profileInfo.name}</div>
              ) : (
                <input
                  type="text"
                  value={profileInfo.name}
                  onChange={(e) =>
                    setProfileInfo({ ...profileInfo, name: e.target.value })
                  }
                />
              )}

              {/* Email */}
              <div className="email">{profileInfo.email}</div>
            </div>
          </div>
          {/* Bio */}
          <p>Bio</p>
          {!isEditing ? (
            <div className="bio">
              {profileInfo.bio || "Edit to update bio!"}{" "}
            </div>
          ) : (
            <input
              type="text"
              value={profileInfo.bio}
              onChange={(e) =>
                setProfileInfo({ ...profileInfo, bio: e.target.value })
              }
            />
          )}

          {/* Interests */}
          <div className="interests-container">
            <p>Interests</p>
            <div className="interests">
              {!isEditing ? (
                profileInfo.interests.length > 0 ? (
                  profileInfo.interests.map((interest) => (
                    <span key={interest} className="interest-block">
                      {interest}
                    </span>
                  ))
                ) : (
                  "Add an interest!"
                )
              ) : (
                <>
                  {profileInfo.interests.map((interest) => (
                    <div key={interest} className="interest-block">
                      {interest}
                      <button className="profile-button" onClick={() => handleRemoveInterest(interest)}>
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                  />
                  <button onClick={handleAddInterest}>Add Interest</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Edit Icon or Save Button based on isEditing state*/}
        {!isEditing ? (
          <button onClick={handleEditClick} className="edit-icon">
            <FontAwesomeIcon icon={faPen} />
          </button>
        ) : (
          <button
            onClick={() => handleSaveClick(profileInfo)}
            className="save-button"
          >
            Save
          </button>
        )}
      </div>
    </>
  );
}

export default Profile;
