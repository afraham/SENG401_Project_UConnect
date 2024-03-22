import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Layout.css";
import logoImage from "../images/logo.png";

function Layout({ signInState }) {
	const nav = useNavigate();

	useEffect(() => {
		// Simulate an asynchronous check for user authentication
		const checkUserAuthentication = () => {
			if (!signInState) {
				nav("/");
			}
		};
		checkUserAuthentication(); // Call the function to check user authentication status
	}, [nav, signInState]);

	const handleLogout = async () => {
	        try {
	            await signOut(auth);
	            console.log("User signed out");
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
						<li onClick={handleLogout} style={{cursor: 'pointer'}}>
                            				Logout
                        			</li>
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
