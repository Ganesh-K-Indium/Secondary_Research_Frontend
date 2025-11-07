// Migration utility to convert old localStorage messages to new session format
export function migrateOldMessagesToSessions() {
  try {
    // Check if old format data exists
    const oldRagMessages = localStorage.getItem('ragMessages');
    const oldIngestionMessages = localStorage.getItem('ingestionMessages');
    
    // Check if new format already exists
    const existingSessions = localStorage.getItem('chatSessions');
    
    // Only migrate if old data exists and new data doesn't
    if ((oldRagMessages || oldIngestionMessages) && !existingSessions) {
      const sessions = [];
      
      let migratedRagMessages = [];
      let migratedIngestionMessages = [];
      
      // Migrate RAG messages if they exist and have content
      if (oldRagMessages) {
        try {
          const ragMessages = JSON.parse(oldRagMessages);
          if (ragMessages && ragMessages.length > 0) {
            migratedRagMessages = ragMessages;
          }
        } catch (e) {
          console.warn('Failed to migrate RAG messages:', e);
        }
      }
      
      // Migrate Ingestion messages if they exist and have content
      if (oldIngestionMessages) {
        try {
          const ingestionMessages = JSON.parse(oldIngestionMessages);
          if (ingestionMessages && ingestionMessages.length > 0) {
            migratedIngestionMessages = ingestionMessages;
          }
        } catch (e) {
          console.warn('Failed to migrate Ingestion messages:', e);
        }
      }
      
      // Create a single unified session with both types of messages
      if (migratedRagMessages.length > 0 || migratedIngestionMessages.length > 0) {
        const allMessages = [...migratedRagMessages, ...migratedIngestionMessages]
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        
        const unifiedSession = {
          id: 'migrated_session_' + Date.now(),
          name: generateSessionNameFromMessages(allMessages),
          ragMessages: migratedRagMessages,
          dataSourcesMessages: migratedIngestionMessages,
          messages: allMessages,
          createdAt: Date.now() - 86400000, // 1 day ago
          lastUpdated: Date.now()
        };
        sessions.push(unifiedSession);
      }
      
      // Save migrated sessions
      if (sessions.length > 0) {
        localStorage.setItem('chatSessions', JSON.stringify(sessions));
        localStorage.setItem('currentSessionId', sessions[0].id);
        
        console.log(`Successfully migrated ${sessions.length} session(s) from old format`);
        
        // Optionally, we can keep the old data for a while in case something goes wrong
        // localStorage.removeItem('ragMessages');
        // localStorage.removeItem('ingestionMessages');
        
        return sessions;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Migration failed:', error);
    return null;
  }
}

function generateSessionNameFromMessages(messages) {
  if (messages.length > 0) {
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    if (firstUserMessage && firstUserMessage.text) {
      return firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
    }
  }
  return 'Migrated Chat Session';
}

// Check if migration is needed
export function shouldMigrate() {
  const oldRagMessages = localStorage.getItem('ragMessages');
  const oldIngestionMessages = localStorage.getItem('ingestionMessages');
  const existingSessions = localStorage.getItem('chatSessions');
  
  return (oldRagMessages || oldIngestionMessages) && !existingSessions;
}