import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Layout.css"

function Layout( { signInState } ) {

  const nav = useNavigate()

  useEffect(() => {
    // Simulate an asynchronous check for user authentication
    const checkUserAuthentication = () => {
      console.log(signInState)
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
          <li>
            <Link to="/user">Home</Link>
          </li>
          <li>
            <Link to="/user/findevents">Find Events</Link>
          </li>
          <li>
            <Link to="/user/myevents">My Events</Link>
          </li>
        </ul>
      </nav>
    </div>

    <Outlet />
  </>
  );
}
export default Layout;
