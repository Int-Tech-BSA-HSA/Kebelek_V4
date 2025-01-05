// src/pages/HomePage.js
import React from 'react';
import ChatBot from './ChatBot'; 

function HomePage({ setReloadSidebar }) {
  return (
    <div>
      {/* Site Title or Welcome Header */}
      <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '24px', fontWeight: 'bold' }}>
        YOUR PERSONAL LAB ASSISTANT
      </div>

      {/* ChatBot Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '75vh',
          backgroundColor: '#fff',
        }}
      >
        <ChatBot setReloadSidebar={setReloadSidebar} />
      </div>

      
    </div>
  );
}

export default HomePage;
