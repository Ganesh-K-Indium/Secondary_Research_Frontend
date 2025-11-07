import { useState, useEffect } from 'react';

// Generate unique session ID
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Generate session name based on first message
const generateSessionName = (messages) => {
  if (messages.length > 0) {
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    if (firstUserMessage && firstUserMessage.text) {
      // Take first 30 characters of the first user message
      return firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
    }
  }
  return 'New Chat Session';
};

export function useSessionManager() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem('currentSessionId');
    return saved || null;
  });

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save current session ID
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('currentSessionId', currentSessionId);
    }
  }, [currentSessionId]);

  // Get current session
  const getCurrentSession = () => {
    return sessions.find(session => session.id === currentSessionId) || null;
  };

  // Create new session - sessions can contain both RAG and Data Sources messages
  const createNewSession = () => {
    const newSession = {
      id: generateSessionId(),
      name: 'New Chat Session',
      messages: [], // Will contain messages from both modes
      ragMessages: [], // Separate arrays for each mode
      dataSourcesMessages: [],
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession;
  };

  // Switch to existing session
  const switchToSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      return session;
    }
    return null;
  };

  // Update session messages for specific mode
  const updateSessionMessages = (sessionId, messages, mode) => {
    // Ensure messages is always an array
    const safeMessages = Array.isArray(messages) ? messages : [];
    
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const updatedSession = {
          ...session,
          lastUpdated: Date.now()
        };
        
        // Update messages for the specific mode
        if (mode === 'rag') {
          updatedSession.ragMessages = safeMessages;
        } else if (mode === 'dataSources') {
          updatedSession.dataSourcesMessages = safeMessages;
        }
        
        // Combine all messages for display and naming
        const allMessages = [
          ...(updatedSession.ragMessages || []),
          ...(updatedSession.dataSourcesMessages || [])
        ].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        
        updatedSession.messages = allMessages;
        
        // Auto-generate name from first user message if still using default name
        if (session.name.startsWith('New ') && allMessages.length > 0) {
          updatedSession.name = generateSessionName(allMessages);
        }
        
        return updatedSession;
      }
      return session;
    }));
  };

  // Delete session
  const deleteSession = (sessionId) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // If deleting current session, switch to most recent one or null
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        setCurrentSessionId(null);
        localStorage.removeItem('currentSessionId');
      }
    }
  };

  // Rename session
  const renameSession = (sessionId, newName) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          name: newName,
          lastUpdated: Date.now()
        };
      }
      return session;
    }));
  };

  // Clear all sessions
  const clearAllSessions = () => {
    setSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem('chatSessions');
    localStorage.removeItem('currentSessionId');
  };

  // Get sessions by mode
  const getSessionsByMode = (mode) => {
    return sessions.filter(session => session.mode === mode);
  };

  // Duplicate session
  const duplicateSession = (sessionId) => {
    const originalSession = sessions.find(s => s.id === sessionId);
    if (!originalSession) return null;

    const duplicatedSession = {
      ...originalSession,
      id: generateSessionId(),
      name: `${originalSession.name} (Copy)`,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    setSessions(prev => [duplicatedSession, ...prev]);
    return duplicatedSession;
  };

  return {
    sessions,
    currentSessionId,
    getCurrentSession,
    createNewSession,
    switchToSession,
    updateSessionMessages,
    deleteSession,
    renameSession,
    clearAllSessions,
    getSessionsByMode,
    duplicateSession
  };
}