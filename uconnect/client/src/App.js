import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./firebase"; // Importing the Firebase auth module for authentication
import SignIn from "./sign-ins/SignIn.js";  // Importing Sign-in page component
import SignUp from "./sign-ins/SignUp.js"; // Sign-up page component
import Layout from "./layouts/Layout.js"; // Importing Layout component that contains the Navbar
import NoPage from "./layouts/NoPage.js"; // No page Displayed for unmatched routes
import Profile from "./profile/Profile.js"; // Importing User profile page component
import MyEvents from "./events/MyEvents.js"; // Importing User's events page component
import FindEvents from "./events/FindEvents.js"; // Importing All Events page component
import EventDetails from './events/EventDetails'; // Individual event details page for each event

function App() {
  const [isSignedIn, setSignedIn] = useState(false);

  /*
    useEffect hook to monitor authentication state changes.
    Automatically sets isSignedIn based on the user's authentication status.
  */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    });

    return unsubscribe;
  }, []);
  
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SignIn changeSignInState={setSignedIn} />} /> {/* Route for the sign-in page */}
				<Route path="signup" element={<SignUp />} /> {/* Route for the sign-up page */}
				<Route path="/user" element={<Layout signInState={isSignedIn} />}> {/* Route for the user dashboard */}
					<Route index element={<FindEvents />} /> {/* Default child route under '/user', shows Other's event on FindEvent page */}
					<Route path="/user/myevents" element={<MyEvents />} /> {/* Child route for viewing user's events */}
					<Route path="/user/myprofile" element={<Profile />} /> {/* Child route for user's profile page */}
					<Route path="/user/events/:eventId" element={<EventDetails />} /> {/* Child route for individual event details for each event */}
				</Route>
				<Route path="*" element={<NoPage />} /> {/* Fallback route for unmatched paths */}s
			</Routes>
		</BrowserRouter>
	);
}

export default App;
