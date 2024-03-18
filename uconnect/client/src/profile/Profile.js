import React, { useState } from "react";
import "./Profile.css";
import default_picture from "../images/default_picture.jpg";

function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const [profileInfo, setProfileInfo] = useState({
		name: "Firstname Lastname",
		email: "email@example.com",
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

					{/* Bio */}
					{!isEditing ? (
						<div className="bio">{profileInfo.bio || "Bio"}</div>
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
					{!isEditing ? (
						profileInfo.interests.length > 0 ? (
							profileInfo.interests.map((interest) => (
								<span key={interest}>{interest}</span>
							))
						) : (
							"Interests"
						)
					) : (
						<>
							{profileInfo.interests.map((interest) => (
								<div key={interest}>
									{interest}
									<button onClick={() => handleRemoveInterest(interest)}>
										Remove
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

				{/* Edit Icon or Save Button based on isEditing state*/}
				{!isEditing ? (
					<button onClick={handleEditClick} className="edit-icon">
						Edit
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
