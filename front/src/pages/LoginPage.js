/*import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Login failed');
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token); // store token
      setIsLoggedIn(true); // Update login state
      navigate('/');
    } catch (error) {
      alert('Login failed');
    }
  }

  return (
    <div>
      <h2>Log In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default LoginPage;   */

// LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Import the CSS file

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  async function handleLogin() {
    setError(''); // Reset error message
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token); // store token
      setIsLoggedIn(true); // Update login state
      navigate('/');
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  }

  return (
    <div className="App-header">
      <div className="login-container">
        <h2>Log In</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Log In
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
