/*import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleRegister() {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      alert('Registration successful');
      navigate('/login');
    } else {
      const data = await res.json();
      alert(data.error || 'Registration failed');
    }
  }

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterPage;  */

// RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Reusing LoginPage.css for consistency

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for password confirmation
  const [error, setError] = useState(''); // State for error messages
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  async function handleRegister() {
    setError(''); // Reset error message

    // Basic client-side validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        alert('Registration successful');
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  }

  return (
    <div className="App-header">
      <div className="login-container">
        <h2>Register</h2>
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

        <div className="form-group password-toggle">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="form-group password-toggle">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="login-button" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
