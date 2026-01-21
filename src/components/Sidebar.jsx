import React, { useEffect, useState } from 'react';
import { getSessions, deleteSession } from '../api';

const Sidebar = ({ currentSessionId, onSelectSession, onNewChat }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, [currentSessionId]); 

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (e) {
      console.error("Failed to fetch sessions", e);
    }
  };

  const handleDelete = async (e, id) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this chat?")) {
        try {
            await deleteSession(id);
            // If deleting current session, start new chat
            if (id === currentSessionId) {
                onNewChat();
            }
            fetchSessions();
        } catch (e) {
            console.error("Failed to delete session", e);
        }
      }
  };

  return (
    <div className="sidebar glass-panel">
        <button className="new-chat-btn" onClick={onNewChat}>
            <span style={{fontSize: '1.1rem', marginRight: '8px'}}>💬</span>
            New Chat
        </button>
        
        <div className="session-list">
            <h3>📚 Recent Chats</h3>
            {sessions.length === 0 && (
                <p style={{
                    opacity: 0.5, 
                    padding: '20px 10px', 
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--text-subtle)'
                }}>
                    No chats yet. Start a conversation!
                </p>
            )}
            {sessions.map(session => (
                <div 
                    key={session.id} 
                    className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
                    onClick={() => onSelectSession(session.id)}
                >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div className="session-title">
                            <span style={{opacity: 0.7, marginRight: '6px'}}>💭</span>
                            {session.title || "Untitled Chat"}
                        </div>
                        <button 
                            className="delete-btn"
                            onClick={(e) => handleDelete(e, session.id)}
                            title="Delete Chat"
                        >
                            🗑️
                        </button>
                    </div>
                    <div className="session-date">
                        <span style={{opacity: 0.6, marginRight: '4px'}}>📅</span>
                        {new Date(session.created_at).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Sidebar;
