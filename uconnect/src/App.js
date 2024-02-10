import "./App.css";

function App() {
  return (
    <div className="LoginPage">
      <div className="SigninContainer">
        <form>
          <h1>Welcome to UConnect!</h1>
          <h2>Sign In</h2>
            <label htmlFor="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="uname"
              required
            />
            <label htmlFor="upass">
              <b>Password</b>
            </label>
            <input
              type="password" // Changed type to 'password' for security
              placeholder="Enter Password"
              name="upass"
              required
            />
            <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
