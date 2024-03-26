import React, { useState, useEffect } from "react";
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

  // Function to enable editing mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const storedProfileInfo = localStorage.getItem('profileInfo');
    if (storedProfileInfo) {
      setProfileInfo(JSON.parse(storedProfileInfo));
    } else {
      const userEmail = auth.currentUser ? auth.currentUser.email : "email@example.com";
      fetchProfileInfo(userEmail);
    }
  }, []);

  const handleSaveClick = async (updatedInfo) => {
    try {
      // Save to backend
      await fetch("http://localhost:8000/api/profiles/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInfo),
      });
      // Save to localStorage
      localStorage.setItem('profileInfo', JSON.stringify(updatedInfo));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Fetching all the info from the backend pfp if the email matches
  const fetchProfileInfo = async (email) => {
    try {
      console.log("Fetching profile info for email:", email);
      const response = await fetch(`http://localhost:8000/api/profiles/${email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch profile information: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("data to be updated: ", data);
      setProfileInfo(data);
    } catch (error) {
      console.error("Error fetching profile information:", error.message);
    }
  };
  
  // Call the fetchProfileInfo function with the email when the component mounts
  useEffect(() => {
    const userEmail = auth.currentUser ? auth.currentUser.email : "email@example.com";
    console.log(userEmail);
    fetchProfileInfo(userEmail);
  }, []);
  
  
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
