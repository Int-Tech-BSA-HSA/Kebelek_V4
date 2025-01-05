// src/pages/ChatPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';

function ChatPage() {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [chatName, setChatName] = useState('');

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated.');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/chats/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setChat(response.data);
      } catch (err) {
        console.error('Error fetching chat:', err);
        setError('Failed to load chat.');
      }
    };

    fetchChat();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      sender: 'user',
      content: newMessage.trim(),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Send the new message to the backend
      const response = await axios.put(`http://localhost:3000/api/chats/${id}`, { message: userMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChat(response.data);
      setNewMessage('');
      setError('');

      // Get assistant response from backend QA endpoint
      const assistantResponse = await axios.post('http://localhost:3000/api/qa', { prompt: userMessage.content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const assistantMessage = {
        sender: 'assistant',
        content: assistantResponse.data.reply,
      };

      // Send assistant's message to the chat
      const updatedChat = await axios.put(`http://localhost:3000/api/chats/${id}`, { message: assistantMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChat(updatedChat.data);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChatClick = () => {
    setShowSaveModal(true);
  };

  const handleSaveChatOk = async () => {
    try {
      const chatText = messages.join('\n');
      await axios.post('/api/users/chats', {
        chatName,
        chatContent: chatText
      });
      // optional: reset or show success message
      setShowSaveModal(false);
      setChatName('');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !chat) {
    return <div className="chat-page">Loading...</div>;
  }

  if (error) {
    return <div className="chat-page error">{error}</div>;
  }

  if (!chat) {
    return <div className="chat-page">No chat selected.</div>;
  }

  return (
    <div className="chat-page">
      <h2>{chat.title}</h2>
      <div className="messages">
        {chat.messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'user' ? 'user' : 'assistant'}`}>
            <p>{msg.content}</p>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          rows="3"
          disabled={loading}
        ></textarea>
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
        <button onClick={handleSaveChatClick}>Save Chat</button>
      </div>

      {showSaveModal && (
        <div className="save-chat-modal">
          <h3>Name your chat</h3>
          <input 
            value={chatName} 
            onChange={(e) => setChatName(e.target.value)} 
            placeholder="Enter chat name..."
          />
          <button onClick={handleSaveChatOk}>OK</button>
          <button onClick={() => setShowSaveModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
