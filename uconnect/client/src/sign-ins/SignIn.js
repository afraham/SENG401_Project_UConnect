import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebase";

function SignIn({ changeSignInState }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const nav = useNavigate(); // To navigate to main page after sign in


	/*
		handleSignIn
		Handles the sign in process when the form is submitted.
		
		Params:
			- e: Object, the event object to prevent default form submission behavior.
		
		Returns: None, but performs sign-in operation and navigates the user to a new route on success.
	*/
	const handleSignIn = async (e) => {
		e.preventDefault(); // Prevents the default form submission behavior
		try {
			await setPersistence(auth, browserLocalPersistence);
			await signInWithEmailAndPassword(auth, email, password);
			console.log("User signed in successfully");
			// Upon successful sign in, you can redirect the user or change the application state
			nav("/user");
			changeSignInState(true);
		} catch (error) {
			console.error("Error signing in:", error.message);
			console.error("Error setting persistence or signing in:", error.message);
			// Handle errors here, such as displaying a notification to the user
		}
	};

	//Render the Sign in component
	return (
		<div className="LoginPage">
			<div className="SigninContainer">
				<form onSubmit={handleSignIn}>
					<h1>UConnect</h1>
					<h2>Sign In</h2>
					<input
						type="email"
						placeholder="Enter Email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Enter Password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button type="submit" >Sign In</button>
					<img src={require("../images/logo.png")} alt="Logo.png"/>
					<p style={{ cursor: "pointer" }}>
						<Link to="/signup"> Don't have an account? Sign Up</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

export default SignIn;
