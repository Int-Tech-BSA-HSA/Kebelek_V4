
import React, { useState } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you with your lab experiments today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add the user's message
    const userMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      // Call your backend endpoint
      const response = await fetch('http://localhost:3000/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }
      const data = await response.json();

      // Suppose your backend response looks like: { answer: "..." }
      const assistantMessage = {
        role: 'assistant',
        content: data.answer || 'Sorry, I got no response.'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error fetching AI response:', err);
      // You can display an error message or fallback
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, an error occurred while fetching AI response.' }
      ]);
    } finally {
      setIsTyping(false);
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
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBot;