import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./firebase";
import SignIn from "./sign-ins/SignIn.js";
import SignUp from "./sign-ins/SignUp.js";
import Layout from "./layouts/Layout.js";
import NoPage from "./layouts/NoPage.js";
import Profile from "./profile/Profile.js";
import MyEvents from "./events/MyEvents.js";
import FindEvents from "./events/FindEvents.js";
import CommentComp from './events/CommentComp.js';
import EventDetails from './events/EventDetails';

function App() {
  const [isSignedIn, setSignedIn] = useState(false);

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
				<Route path="/" element={<SignIn changeSignInState={setSignedIn} />} />
				<Route path="signup" element={<SignUp />} />
				<Route path="/user" element={<Layout signInState={isSignedIn} />}>
					<Route index element={<FindEvents />} />
					<Route path="/user/myevents" element={<MyEvents />} />
					<Route path="/user/myprofile" element={<Profile />} />
					<Route path="/user/events/:eventId" element={<EventDetails />} />
				</Route>
				<Route path="*" element={<NoPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
