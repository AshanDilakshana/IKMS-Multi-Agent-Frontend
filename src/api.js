
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8001";

export const sendMessage = async (question, session_id) => {
  try {
    const response = await fetch(`${API_BASE}/qa/conversation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        question, 
        session_id: session_id || null 
      }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Request failed");
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getHistory = async (session_id) => {
  if (!session_id) return [];
  try {
    const response = await fetch(`${API_BASE}/qa/session/${session_id}/history`);
    if (!response.ok) throw new Error("Failed to fetch history");
    return await response.json();
  } catch (error) {
    console.error("History Error:", error);
    throw error;
  }
};

export const getSessions = async () => {
    const response = await fetch(`${API_BASE}/qa/sessions`);
    if (!response.ok) {
        throw new Error("Failed to load sessions");
    }
    return response.json();
};

export const deleteSession = async (sessionId) => {
    const response = await fetch(`${API_BASE}/qa/session/${sessionId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error("Failed to delete session");
    }
};
