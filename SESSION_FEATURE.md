# Session Management Feature

## Overview

The Secondary Research Agent now includes a comprehensive session management system similar to ChatGPT, allowing users to:

- Create multiple chat sessions
- Switch between sessions seamlessly
- Rename and delete sessions
- Maintain separate conversation histories
- Export session data

## Features

### Session Sidebar
- **Collapsible sidebar** with session list
- **Visual indicators** for session mode (RAG/Ingestion)
- **Session metadata** showing last updated time and message count
- **Quick actions** for renaming and deleting sessions

### Session Management
- **Auto-naming** sessions based on first user message
- **Persistent storage** using localStorage
- **Migration utility** for existing users
- **Real-time updates** of session data

### Enhanced UI
- **Mode indicators** showing current session type
- **Session info** in the navbar
- **New session button** for quick access
- **Seamless transitions** between sessions

## Components

### SessionSidebar.js
Main sidebar component handling:
- Session list display
- Session selection
- Rename/delete operations
- Collapse/expand functionality

### useSessionManager.js
Custom hook providing:
- Session CRUD operations
- localStorage persistence
- Migration utilities
- Session state management

### Migration System
Automatic migration from old format:
- Converts existing `ragMessages` and `ingestionMessages`
- Creates sessions with appropriate names
- Preserves conversation history
- Non-destructive migration

## Usage

### Creating a New Session
1. Click the "New" button in the navbar
2. Or click the "+" button in the sidebar
3. Choose your mode (automatically inherits current mode)

### Switching Sessions
1. Click on any session in the sidebar
2. Session loads with full conversation history
3. Mode switches automatically to match session type

### Managing Sessions
1. **Rename**: Hover over session → click edit icon
2. **Delete**: Hover over session → click delete icon
3. **Export**: Use existing export functionality (works per session)

## Technical Implementation

### Data Structure
```javascript
{
  id: "session_timestamp_random",
  name: "Session name",
  mode: "rag" | "ingestion",
  messages: [...],
  createdAt: timestamp,
  lastUpdated: timestamp
}
```

### Storage
- Sessions stored in `localStorage` as `chatSessions`
- Current session ID stored as `currentSessionId`
- Automatic persistence on all operations

### Migration
- Runs once on app initialization
- Checks for old format data
- Creates equivalent sessions
- Preserves conversation history

## Benefits

1. **Better Organization**: Separate conversations by topic or purpose
2. **Improved UX**: ChatGPT-like familiar interface
3. **Data Persistence**: Never lose conversation history
4. **Flexible Workflow**: Switch between search and contribution modes
5. **Easy Management**: Rename, delete, and organize sessions

## Backward Compatibility

The system includes automatic migration to ensure existing users don't lose their conversation history. Old data is preserved while new session-based storage is created.