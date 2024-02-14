import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function SignIn( {changeSignInState} ) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
      // Upon successful sign in, you can redirect the user or change the application state
      nav("/user")
      changeSignInState(true)
    } catch (error) {
      console.error("Error signing in:", error.message);
      // Handle errors here, such as displaying a notification to the user
    }
  };

  return (
    <div className="LoginPage">
      <div className="SigninContainer">
        <form onSubmit={handleSignIn}>
              <h1>Welcome to UConnect!</h1>
              <h2>Sign In</h2>
              <label htmlFor="email">
                <b>Email</b>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password">
                <b>Password</b>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Sign In</button>
              <p style={{ cursor: "pointer" }}>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
