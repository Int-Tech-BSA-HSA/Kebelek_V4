import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SavedChatPage() {
  const { id } = useParams();        // read from URL /saved-chats/:id
  const [chat, setChat] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not logged in.');
          return;
        }
        const response = await axios.get(`http://localhost:3000/api/chats/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChat(response.data);
      } catch (err) {
        console.error('Error fetching chat:', err);
        setError('Failed to fetch chat.');
      }
    };
    fetchChat();
  }, [id]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!chat) return <div>Loading chat...</div>;

  // Convert array of messages to a text block
  const textContent = chat.messages
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  return (
    <div style={{ padding: '20px' }}>
      <h2>{chat.title}</h2>
      <textarea
        rows={15}
        cols={80}
        value={textContent}
        readOnly
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}

export default SavedChatPage; 