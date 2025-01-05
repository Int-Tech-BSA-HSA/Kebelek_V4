// src/App.js

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ChemicalEquilibrium from "./pages/ChemicalEquilibrium";
import RateLaws from "./pages/RateLaws";
import Thermodynamics from "./pages/Thermodynamics";
import Stoichiometry from "./pages/Stoichiometry";
import EnzymeKinetics from "./pages/EnzymeKinetics";
import PersonalTest from "./pages/PersonalTest";
import Sidebar from "./components/Sidebar";
import ChatPage from "./pages/ChatPage";
import { FaBars, FaUser } from "react-icons/fa";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SavedChatPage from './pages/SavedChatPage';
import ChatBot from './pages/ChatBot';

function App() {
  const [reloadSidebar, setReloadSidebar] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    setIsLoggedIn(true);
    }
    }, []);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close Sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  async function handleRegister() {
    await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    // ...handle success or failure...
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // new: remove token on logout
    setIsSidebarOpen(false); // optional: close sidebar on logout
    // ...any additional logout logic...
  }

  return (
    <Router>
      <div className={`App ${isSidebarOpen ? "sidebar-open" : ""} ${isLoggedIn ? "logged-in" : ""}`}>
        {/* Toggle Button */}
        <button
          className="menu-icon"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars size={24} />
        </button>

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          reloadTrigger={reloadSidebar}
        />

        {/* Overlay */}
        {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

        {/* User Icon and Menu */}
        <div className="top-right">
          <FaUser onClick={toggleUserMenu} className="user-icon" />
          {userMenuOpen && (
            <div className="user-menu">
              {!isLoggedIn ? (
                <>
                  <Link to="/register">Register</Link>
                  <Link to="/login">Log In</Link>
                </>
              ) : (
                <button onClick={handleLogout}>Log Out</button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/chemical-equilibrium">Chemical Equilibrium</Link>
            </li>
            <li>
              <Link to="/rate-laws">Rate Laws</Link>
            </li>
            <li>
              <Link to="/thermodynamics">Thermodynamics</Link>
            </li>
            <li>
              <Link to="/stoichiometry">Stoichiometry</Link>
            </li>
            <li>
              <Link to="/enzyme-kinetics">Enzyme Kinetics</Link>
            </li>
            <li>
              <Link to="/personal-test">Personal Test</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage setReloadSidebar={setReloadSidebar} />} />
            <Route path="/chemical-equilibrium" element={<ChemicalEquilibrium />} />
            <Route path="/rate-laws" element={<RateLaws />} />
            <Route path="/thermodynamics" element={<Thermodynamics />} />
            <Route path="/stoichiometry" element={<Stoichiometry />} />
            <Route path="/enzyme-kinetics" element={<EnzymeKinetics />} />
            <Route path="/personal-test" element={<PersonalTest />} />
            <Route path="/chats/:id" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/saved-chats/:id" element={<SavedChatPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



