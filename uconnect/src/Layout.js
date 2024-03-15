import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Layout.css"
import logoImage from './images/logo.png';

function Layout( { signInState } ) {

  const nav = useNavigate()

  useEffect(() => {
    // Simulate an asynchronous check for user authentication
    const checkUserAuthentication = () => {
      if (!signInState) {
        nav("/")
      }

    };
    checkUserAuthentication(); // Call the function to check user authentication status
  }, [nav, signInState]);

  return (
    <>
    <div className='navbar'>
      <nav>
        
        <ul>
        <img src={logoImage} alt="Logo" className="navbar-logo" /> 
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
