import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ChemicalEquilibrium from './pages/ChemicalEquilibrium';
import RateLaws from './pages/RateLaws';
import Thermodynamics from './pages/Thermodynamics';
import Stoichiometry from './pages/Stoichiometry';
import EnzymeKinetics from './pages/EnzymeKinetics';

function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you with your lab experiments today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // Typing state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to the chat
    const userMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true); // Show typing indicator

    // Send the user message to the backend API
    try {
      const response = await fetch('http://localhost:3000/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userInput })
      });
      const data = await response.json();

      // Add assistant response to the chat
      if (data && data.answer) {
        const assistantMessage = { role: 'assistant', content: data.answer };
        setMessages(prev => [...prev, assistantMessage]);
        if (data.graph) {
          // Insert the HTML string for the graph into the chat
          const assistantGraphMessage = { role: 'assistant', content: data.graph };
          setMessages(prev => [...prev, assistantGraphMessage]);
        }
      } else {
        // In case something is off with the response
        const errorMessage = { role: 'assistant', content: 'Sorry, I couldn’t get a response right now.' };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error fetching from backend:', error);
      const errorMessage = { role: 'assistant', content: 'Error contacting the server.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally{
      setIsTyping(false); // Hide typing indicator
    }
  };

  return (
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', width: '800px', height: '600px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', background: '#f9f9f9', padding: '10px' }}>
          {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <div
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '16px',
                      background: msg.role === 'user' ? '#d1f7d6' : '#e0e0e0',
                      maxWidth: '70%'
                    }}
                >
                  {msg.role === 'assistant' && msg.content.includes('<img')
                    ? <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                    : msg.content}
                </div>
              </div>
          ))}

        {/* Typing Indicator */ }
        {isTyping && (
          <div
            style={{
              marginBottom: '10px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '16px',
                background: '#e0e0e0',
                maxWidth: '70%',
                fontStyle: 'italic',
                color: '#555',
              }}
            >
              ...
            </div>
          </div>
        )}

        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
          <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your question..."
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ marginLeft: '8px', padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#007bff', color: '#fff' }}>
            Send
          </button>
        </form>
      </div>
  );
}



function App() {
  const [backendMessage, setBackendMessage] = useState('');

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:3000/api/hello')
        .then(response => response.json())
        .then(data => {
          if (data && data.message) {
            setBackendMessage(data.message);
          }
        })
        .catch(err => console.error('Error fetching from backend:', err));
  }, []);

  return (
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/chemical-equilibrium">Chemical Equilibrium</Link></li>
              <li><Link to="/rate-laws">Rate Laws</Link></li>
              <li><Link to="/thermodynamics">Thermodynamics</Link></li>
              <li><Link to="/stoichiometry">Stoichiometry</Link></li>
              <li><Link to="/enzyme-kinetics">Enzyme Kinetics</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/chemical-equilibrium" element={<ChemicalEquilibrium />} />
            <Route path="/rate-laws" element={<RateLaws />} />
            <Route path="/thermodynamics" element={<Thermodynamics />} />
            <Route path="/stoichiometry" element={<Stoichiometry />} />
            <Route path="/enzyme-kinetics" element={<EnzymeKinetics />} />
          </Routes>

          {/* Site Title or Welcome Header */}
          <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '24px', fontWeight: 'bold' }}>
            YOUR PERSONAL LAB ASSISTANT
          </div>

        {/* Routes */}

          {/* Updated ChatBot Section */}
          <div
              style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '75vh', // Full screen height
              backgroundColor: '#fff', // Light gray background
            }}
          >
            <ChatBot />
          </div>
        </div>
      </Router>
  );
}

export default App;
