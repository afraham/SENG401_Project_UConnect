import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
			if (error.code === "auth/email-already-in-use") {
				alert("The email address is already in use by another account.");
			} else if (error.code === "auth/invalid-email") {
				alert("Please provide a valid email address.");
			} else if (error.code === "auth/weak-password") {
				alert(
					"The password is too weak, please ensure it has 6 or more characters."
				);
			}
		}
	};

	//Render the Sign up component
	return (
		<div className="LoginPage">
			<div className="SigninContainer">
				<form onSubmit={handleSignUp}>
					<h1>UConnect</h1>
					<h2>Sign Up</h2>
					<input
						type="email"
						placeholder="Enter Your Email"
						name="newEmail"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Create a Password"
						name="newPassword"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button type="submit">Sign Up</button>
					<img src={require("../images/logo.png")} alt="Logo.png" />
					<p style={{ cursor: "pointer" }}>
						<Link to="/"> Already have an account? Sign In</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
