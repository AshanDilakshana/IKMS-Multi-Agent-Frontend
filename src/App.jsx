import { useState, useEffect, useRef } from 'react';
import { sendMessage, getHistory } from './api';
import ThinkingAnimation from './components/ThinkingAnimation';
import Sidebar from './components/Sidebar';
import './index.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(localStorage.getItem("session_id") || "");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      loadHistory(sessionId);
    } else {
        setMessages([]);
    }
  }, [sessionId]);

  const loadHistory = async (id) => {
    try {
      const history = await getHistory(id);
      // Backend now returns [{question, answer, context, timestamp}, ...]
      // We need to flatten this to our message format: User -> Assistant
      const formatted = history.flatMap(turn => {
          const msgs = [];
          if (turn.question) {
              msgs.push({ type: 'user', content: turn.question, timestamp: turn.timestamp });
          }
          if (turn.answer) {
              msgs.push({ 
                  type: 'assistant', 
                  content: turn.answer, 
                  context: turn.context, 
                  timestamp: turn.timestamp 
              });
          }
          return msgs;
      });
      setMessages(formatted);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { type: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const currentSessionId = sessionId || undefined;
      const res = await sendMessage(userMsg.content, currentSessionId, abortControllerRef.current.signal);
      
      if (!sessionId && res.session_id) {
        setSessionId(res.session_id);
        localStorage.setItem("session_id", res.session_id);
      }

      const assistantMsg = {
        type: 'assistant',
        content: res.answer,
        context: res.context,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      if (e.name === 'AbortError') {
          console.log('Request aborted');
          // Optional: Add a message indicating cancellation
          // setMessages(prev => [...prev, { type: 'assistant', content: "🛑 Generation stopped." }]);
      } else {
          setMessages(prev => [...prev, { type: 'assistant', content: "Error: " + e.message }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSelectSession = (id) => {
      setSessionId(id);
      localStorage.setItem("session_id", id);
  };

  const handleNewSession = () => {
    localStorage.removeItem("session_id");
    setSessionId("");
    setMessages([]);
  };

  const handleStop = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
      }
      setIsLoading(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="app">
      <header>
        <h1>IKMS Agent</h1>
      </header>
      
      <div className="main-layout">
        <Sidebar 
            currentSessionId={sessionId} 
            onSelectSession={handleSelectSession} 
            onNewChat={handleNewSession} 
        />

        <div className="chat-container">
            <div className="message-list glass-panel" ref={scrollRef}>
            {messages.length === 0 && (
                <div style={{
                    textAlign: 'center', 
                    padding: '60px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    justifyContent: 'center',
                    flex: 1
                }}>
                    <div style={{
                        fontSize: '4rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        width: '120px',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(102, 126, 234, 0.3)',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        🤖
                    </div>
                    <div>
                        <h2 style={{
                            color: 'var(--text-primary)',
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '12px',
                            letterSpacing: '-0.02em'
                        }}>
                            Welcome to IKMS Agent
                        </h2>
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '1rem',
                            lineHeight: '1.6'
                        }}>
                            Your intelligent knowledge management assistant.
                        </p>
                    </div>
                </div>
            )}
            {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                <div className="message-bubble">
                    <div style={{whiteSpace: 'pre-wrap'}}>{msg.content}</div>
                    {msg.context && (
                        <div className="context-badge" title={msg.context}>
                            ℹ️ Context Used
                        </div>
                    )}
                </div>
                </div>
            ))}
            {isLoading && (
                <div className="message assistant">
                <div className="message-bubble">
                    <ThinkingAnimation />
                </div>
                </div>
            )}
            </div>
            
            <div className="input-area glass-panel">
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading}>
                <span style={{position: 'relative', zIndex: 1}}>
                    {isLoading ? '⏳' : '✨'} Send
                </span>
            </button>
            {isLoading && (
                <button 
                  onClick={handleStop}
                  style={{
                      marginLeft: '10px', 
                      background: 'rgba(255, 59, 48, 0.1)', 
                      border: '1px solid rgba(255, 59, 48, 0.3)',
                      color: '#ff3b30'
                  }}
                  title="Stop generation"
                >
                    ⏹ Stop
                </button>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
