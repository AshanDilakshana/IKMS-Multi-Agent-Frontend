import React, { useEffect, useState } from 'react';
import { getSessions, deleteSession } from '../api';

const Sidebar = ({ currentSessionId, onSelectSession, onNewChat, isOpen, onClose }) => {
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
    <div className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <button className="mobile-close-btn" onClick={onClose}>✕</button>
        <button className="new-chat-btn" onClick={onNewChat}>
            <span className="btn-icon">💬</span>
            New Chat
        </button>
        
        <div className="session-list">
            <h3>📚 Recent Chats</h3>
            {sessions.length === 0 && (
                <p className="no-chats-msg">
                    No chats yet. Start a conversation!
                </p>
            )}
            {sessions.map(session => (
                <div 
                    key={session.id} 
                    className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
                    onClick={() => onSelectSession(session.id)}
                >
                    <div className="session-item-content">
                        <div className="session-title">
                            <span className="session-icon">💭</span>
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
                        <span className="date-icon">📅</span>
                        {new Date(session.created_at).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Sidebar;
