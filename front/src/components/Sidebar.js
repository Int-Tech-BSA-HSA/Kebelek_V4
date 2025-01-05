// src/components/Sidebar.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import { FaTimes } from "react-icons/fa"; // Import close icon

function Sidebar({ isOpen, toggleSidebar, reloadTrigger }) {
  const [savedChats, setSavedChats] = useState([]);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChats() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // or show an error

        const response = await axios.get('http://localhost:3000/api/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSavedChats(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchChats();
  }, [reload, reloadTrigger]);

  const handleLoadChat = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const chat = response.data;
      console.log("Loading chat: ", chat);

      navigate(`/saved-chats/${chatId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:3000/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReload(!reload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="green-text">Saved Chats</h2>
        <button
          className="close-button"
          onClick={toggleSidebar}
          aria-label="Close Sidebar"
        >
          <FaTimes size={20} />
        </button>
      </div>
      <ul className="chat-list">
        {savedChats.map(chat => (
          <li key={chat._id} className="chat-item">
            <span
              onClick={() => handleLoadChat(chat._id)}
              className="chat-title"
            >
              {chat.title}
            </span>
            <button
              onClick={() => handleDeleteChat(chat._id)}
              className="delete-chat-button"
              aria-label="Delete Chat"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
