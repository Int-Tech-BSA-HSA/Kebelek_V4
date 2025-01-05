import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatBot({ setReloadSidebar }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you with your lab experiments today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');

  // We remove chatId-based logic, since we won't store messages automatically
  // ...
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user's message locally
    const userMessage = { role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);
    setError('');

    try {
      // Call backend QA endpoint (no chatId, purely for the answer)
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        setIsTyping(false);
        return;
      }
      const response = await axios.post('http://localhost:3000/api/qa', { question: userMessage.content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const assistantContent = response.data.answer || 'Sorry, I got no response.';
      const assistantMessage = { role: 'assistant', content: assistantContent };
      // Add assistant reply locally
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error fetching AI response:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, an error occurred while fetching AI response.' }
      ]);
      setError('Failed to fetch AI response.');
    } finally {
      setIsTyping(false);
    }
  };

  // Save chat after user is done
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [chatName, setChatName] = useState('');

  const handleSaveChatClick = () => {
    setShowSaveModal(true);
  };

  const handleSaveChatOk = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        return;
      }

      // Pass entire array of messages
      // The backend expects something like { title, messages: [...] }
      await axios.post('http://localhost:3000/api/chats', {
        title: chatName,       // or chatName if you prefer
        messages: messages
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowSaveModal(false);
      setChatName('');
      setReloadSidebar(prev => !prev);

    } catch (saveErr) {
      console.error('Error saving chat:', saveErr);
      if (saveErr.response) {
        console.log('Server responded with:', saveErr.response.status, saveErr.response.data);
      }
      setError('Failed to save chat.');
    }
  };

  return (
    <div
      style={{
        width: '50vw',
        height: '80vh',
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          background: '#f9f9f9',
          padding: '10px',
          overflowY: 'auto'
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                background: msg.role === 'user' ? '#d1f7d6' : '#e0e0e0',
                color: '#333',
                padding: '8px 12px',
                borderRadius: '16px',
                maxWidth: '70%',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.3',
                textAlign: 'left' 
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <div
              style={{
                background: '#e0e0e0',
                color: '#333',
                padding: '8px 12px',
                borderRadius: '16px',
                maxWidth: '70%',
                fontStyle: 'italic',
                textAlign: 'left'
              }}
            >
              ...
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        style={{
          borderTop: '1px solid #ccc',
          padding: '10px',
          display: 'flex'
        }}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0 20px',
            borderRadius: '8px',
            border: 'none',
            background: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Send
        </button>

        {/* NEW SAVE BUTTON */}
        <button
          type="button"
          onClick={handleSaveChatClick}
          style={{
            padding: '0 20px',
            borderRadius: '8px',
            border: 'none',
            background: '#28a745',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Save Chat
        </button>
      </form>
      {error && <p style={{ color: 'red', padding: '0 10px' }}>{error}</p>}

      {/* SAVE CHAT POP-UP (MODAL) */}
      {showSaveModal && (
        <div
          style={{
            position: 'fixed',
            top: '30%',
            left: '40%',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '20px',
            zIndex: 9999
          }}
        >
          <h3>Name your chat</h3>
          <input
            type="text"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder="Enter chat name..."
            style={{ marginBottom: '10px', padding: '5px' }}
          />
          <div>
            <button
              onClick={handleSaveChatOk}
              style={{
                marginRight: '10px',
                padding: '5px 10px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
            <button
              onClick={() => setShowSaveModal(false)}
              style={{
                padding: '5px 10px',
                background: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
