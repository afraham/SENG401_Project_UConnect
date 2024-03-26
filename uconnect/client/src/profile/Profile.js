import React, { useState } from "react";
import "./Profile.css";
import default_picture from "../images/default_picture.jpg";
import { auth } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faX,
  faBookmark,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";


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
  const [isAddingInterest, setIsAddingInterest] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async (updatedInfo) => {
    try {  
      await fetch("http://localhost:8000/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInfo),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileInfo({
          ...profileInfo,
          picture: reader.result, // Set the base64-encoded image data
        });
      };
      reader.readAsDataURL(file);
    }
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
            <label htmlFor="image-input" className="image-upload">
              {!isEditing ? (
                <img
                  src={profileInfo.picture || default_picture}
                  alt="Profile"
                  className="avatar"
                />
              ) : (
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="image-input"
                />
              )}
        
            </label>
            {isEditing && profileInfo.picture && (
              <img className="avatar-prev" src={profileInfo.picture} alt="Preview" />
            )}

            <div className="profile-name-email">
              {/* Name */}
              {!isEditing ? (
                <div className="displayName">{profileInfo.name}</div>
              ) : (
                <input
                  className="displayName-input"
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
          <div className="profile-bio-interests">
            {/* Bio */}
            <p>Bio</p>
            {!isEditing ? (
              <div className="bio">
                {profileInfo.bio || "Edit to update bio!"}{" "}
              </div>
            ) : (
              <textarea
                className="bio-input"
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
                        <button
                          className="remove-button"
                          onClick={() => handleRemoveInterest(interest)}
                        >
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      </div>
                    ))}
                    {isAddingInterest ? (
                      <>
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                        />
                        <button
                          className="add-interest"
                          onClick={() => {
                            handleAddInterest();
                            setIsAddingInterest(false);
                          }}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="add-interest"
                        onClick={() => setIsAddingInterest(true)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Icon or Save Button based on isEditing state*/}
        {!isEditing ? (
          <button className="edit-icon" onClick={handleEditClick}>
            <FontAwesomeIcon icon={faPen} />
          </button>
        ) : (
          <button
            onClick={() => handleSaveClick(profileInfo)}
            className="save-icon"
          >
            <FontAwesomeIcon icon={faBookmark} />
          </button>
        )}
      </div>
    </>
  );
}



export default Profile;
