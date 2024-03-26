import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "./Layout.css";
import logoImage from "../images/logo.png";

function Layout({ signInState }) {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const nav = useNavigate();

  /*
    useEffect hook listens for changes in authentication state on component mount and cleanup on unmount.
  */
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserSignedIn(true);
      } else {
        // User is signed out
        setUserSignedIn(false);
        nav("/");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [nav]);


  /*
    handleLogout
    Signs the user out from Firebase authentication.
    
    Params: None
    
    Returns: None, but redirects the user to the home page and updates the sign-in state.
  */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      // Directly update the local sign-in state
      setUserSignedIn(false);
      nav("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <div className="navbar">
        <nav>
          <ul>
            <img src={logoImage} alt="Logo" className="navbar-logo" />
            {userSignedIn && (
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </li>
            )}
            {/* Navigation links to different parts of the app */}
            <li>
              <Link to="/user/myprofile">My Profile</Link>
            </li>
            <li>
              <Link to="/user/myevents">My Events</Link>
            </li>
            <li>
              <Link to="/user">Find Events</Link>
            </li>
          </ul>
        </nav>
      </div>

      <Outlet />
    </>
  );
}
export default Layout;
