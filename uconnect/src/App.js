import React, { useState } from "react";
import "./App.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
      // Upon successful sign in, you can redirect the user or change the application state
    } catch (error) {
      console.error("Error signing in:", error.message);
      // Handle errors here, such as displaying a notification to the user
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully");
      // Upon successful sign up, you can redirect the user or change the application state
    } catch (error) {
      console.error("Error signing up:", error.message);
      // Handle errors here, such as displaying a notification to the user
    }
  };

  return (
    <div className="LoginPage">
      <div className="SigninContainer">
        <form onSubmit={isSignIn ? handleSignIn : handleSignUp}>
          {isSignIn ? (
            <>
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
              <p onClick={() => setIsSignIn(false)} style={{ cursor: "pointer" }}>
                Don't have an account? Sign Up
              </p>
            </>
          ) : (
            <>
              <h1>Welcome to UConnect!</h1>
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
              <p onClick={() => setIsSignIn(true)} style={{ cursor: "pointer" }}>
                Already have an account? Sign In
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
