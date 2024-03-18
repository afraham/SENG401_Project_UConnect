import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";

function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const nav = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault(); // Prevents the default form submission behavior
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			console.log("User created successfully");
			// Upon successful sign up, you can redirect the user or change the application state
			nav("/");
		} catch (error) {
			console.error("Error signing up:", error.message);
			// Handle errors here, such as displaying a notification to the user
		}
	};

	return (
		<div className="LoginPage">
			<div className="SigninContainer">
				<form onSubmit={handleSignUp}>
					<h1>UConnect</h1>
					<h2>Sign Up</h2>
					<label htmlFor="newEmail">
						<b>Email</b>
					</label>
					<input
						type="email"
						placeholder="Enter Your Email"
						name="newEmail"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<label htmlFor="newPassword">
						<b>Password</b>
					</label>
					<input
						type="password"
						placeholder="Create a Password"
						name="newPassword"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button type="submit">Sign Up</button>
					<p style={{ cursor: "pointer" }}>
						Already have an account? <Link to="/">Sign In</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
