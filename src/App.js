import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SessionSidebar from "./components/SessionSidebar";
import { RagChat, IngestionChat } from "./components/StatefulChats";
import { useSessionManager } from "./hooks/useSessionManager";
import { migrateOldMessagesToSessions, shouldMigrate } from "./utils/migration";
import Lander from "./Lander";

function App() {
  const [currentChat, setCurrentChat] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    sessions,
    currentSessionId,
    getCurrentSession,
    createNewSession,
    switchToSession,
    updateSessionMessages,
    deleteSession,
    renameSession
  } = useSessionManager();

  // Run migration on app start if needed
  useEffect(() => {
    if (shouldMigrate()) {
      const migratedSessions = migrateOldMessagesToSessions();
      if (migratedSessions && migratedSessions.length > 0) {
        console.log('Migration completed successfully');
      }
    }
  }, []);

  // Get current session and its messages for the current mode
  const currentSession = getCurrentSession();
  const getCurrentModeMessages = () => {
    if (!currentSession) return [];
    
    if (currentChat === 'rag') {
      return Array.isArray(currentSession.ragMessages) ? currentSession.ragMessages : [];
    } else if (currentChat === 'ingestion') {
      return Array.isArray(currentSession.ingestionMessages) ? currentSession.ingestionMessages : [];
    }
    return [];
  };
  
  const currentMessages = getCurrentModeMessages();

  // No need to set chat type based on session mode since sessions support both modes
  // useEffect removed as sessions are no longer mode-specific

  const handleStartChat = (chatType) => {
    // Set the chat type first, then create session
    setCurrentChat(chatType);
    // Create new session that can handle both modes
    createNewSession();
  };

  const handleNewSession = () => {
    // Create new session that can handle both modes
    createNewSession();
    // Keep current chat mode or default to rag
    if (!currentChat) {
      setCurrentChat('rag');
    }
  };

  const handleSessionSelect = (sessionId) => {
    switchToSession(sessionId);
    // Don't change the current chat mode when switching sessions
    // Users can freely switch between RAG and Ingestion within the same session
  };

  const handleSessionUpdate = (sessionId, messages, mode) => {
    updateSessionMessages(sessionId, messages, mode);
  };

  const setCurrentMessages = (messages) => {
    // Ensure messages is always an array
    const safeMessages = Array.isArray(messages) ? messages : [];
    if (currentSessionId && currentChat) {
      handleSessionUpdate(currentSessionId, safeMessages, currentChat);
    }
  };

  // Removed automatic session creation useEffect to prevent conflicts

  if (!currentChat) {
    return <Lander onStartChat={handleStartChat} />;
  }

  // Ensure we have a session when in chat mode
  if (currentChat && !currentSession) {
    // Create a session if we don't have one
    createNewSession();
    return null; // Return null briefly while session is being created
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Main container with sidebar and chat */}
      <div className="flex-1 flex bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Session Sidebar */}
        <SessionSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar 
            currentChat={currentChat} 
            setCurrentChat={setCurrentChat}
            currentSession={currentSession}
            onNewSession={handleNewSession}
          />

          <div className="flex-1 relative overflow-hidden">
            {/* Simple, professional crossfade transition */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                currentChat === "rag"
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <RagChat 
                messages={currentMessages} 
                setMessages={setCurrentMessages}
                sessionId={currentSessionId}
                onSessionUpdate={handleSessionUpdate}
              />
            </div>

            <div
              className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                currentChat === "ingestion"
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <IngestionChat 
                messages={currentMessages} 
                setMessages={setCurrentMessages}
                sessionId={currentSessionId}
                onSessionUpdate={handleSessionUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
