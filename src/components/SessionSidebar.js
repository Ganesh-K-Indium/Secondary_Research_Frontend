import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SessionSidebar({ 
  sessions, 
  currentSessionId, 
  onSessionSelect, 
  onNewSession, 
  onDeleteSession,
  onRenameSession,
  isCollapsed,
  setIsCollapsed 
}) {
  const { isDark } = useTheme();
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const handleRename = (sessionId, currentName) => {
    setRenamingId(sessionId);
    setRenameValue(currentName);
  };

  const handleRenameSubmit = (sessionId) => {
    if (renameValue.trim()) {
      onRenameSession(sessionId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const handleRenameCancel = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const formatDate = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`h-full transition-all duration-500 flex flex-col ${
      isDark 
        ? 'bg-black border-r border-slate-800/40' 
        : 'bg-white border-r border-gray-200/50'
    } ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-800/40' : 'border-gray-200/50'} ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-900/50 text-gray-500 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'} ${isCollapsed ? 'w-8 h-8 flex items-center justify-center' : ''}`}
          >
            <svg 
              className={`${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'} transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-600'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          
          {!isCollapsed && (
            <>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sessions</h2>
              <button
                onClick={onNewSession}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-900/50 text-gray-500 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="New Session"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sessions List */}
      {!isCollapsed && (
        <div className={`flex-1 overflow-y-auto p-2 space-y-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
          {sessions.length === 0 ? (
            <div className={`text-center mt-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <svg className={`w-12 h-12 mx-auto mb-4 opacity-50 ${isDark ? 'text-gray-700' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">No sessions yet</p>
              <p className="text-xs mt-1">Click + to start a new chat</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  currentSessionId === session.id
                    ? isDark 
                      ? 'bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30'
                      : 'bg-gradient-to-r from-indigo-100/30 to-blue-100/30 border border-indigo-300/50'
                    : isDark
                      ? 'hover:bg-slate-900/50 border border-transparent hover:border-slate-800/50'
                      : 'hover:bg-gray-100 border border-transparent hover:border-gray-300/50'
                }`}
                onClick={() => onSessionSelect(session.id)}
              >
                {renamingId === session.id ? (
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className={`flex-1 text-sm px-2 py-1 rounded border focus:outline-none focus:border-indigo-500 transition-colors duration-200 ${isDark ? 'bg-slate-900/80 text-white border-slate-800/50 placeholder-gray-600' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSubmit(session.id);
                        if (e.key === 'Escape') handleRenameCancel();
                      }}
                      onBlur={() => handleRenameSubmit(session.id)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {session.name}
                        </h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {formatDate(session.lastUpdated)}
                        </p>
                        <p className={`text-xs truncate mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                          SRA: {(session.ragMessages || []).length} • DS: {(session.dataSourcesMessages || []).length} • QA: {(session.quantAgentMessages || []).length}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(session.id, session.name);
                          }}
                          className={`p-1.5 rounded ${isDark ? 'hover:bg-slate-800/50 text-gray-500 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                          title="Rename session"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className={`p-1.5 rounded ${isDark ? 'hover:bg-red-600/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-100 text-gray-600 hover:text-red-600'}`}
                          title="Delete session"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Mode indicators */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {(session.ragMessages && session.ragMessages.length > 0) && (
                        <div className="w-2 h-2 rounded-full bg-teal-400" title="Has Secondary Research messages" />
                      )}
                      {(session.dataSourcesMessages && session.dataSourcesMessages.length > 0) && (
                        <div className="w-2 h-2 rounded-full bg-blue-400" title="Has Data Sources messages" />
                      )}
                      {(session.quantAgentMessages && session.quantAgentMessages.length > 0) && (
                        <div className="w-2 h-2 rounded-full bg-purple-400" title="Has Quant Agent messages" />
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Collapsed view - centered buttons */}
      {isCollapsed && (
        <div className={`flex-1 flex flex-col items-center justify-start pt-2 px-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
          <button
            onClick={onNewSession}
            className={`w-8 h-8 mb-3 rounded-lg flex items-center justify-center ${isDark ? 'hover:bg-gray-900/50 text-gray-500 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            title="New Session"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <div className="w-full space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 relative ${
                  currentSessionId === session.id
                    ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                    : isDark
                      ? 'bg-gray-900/50 text-gray-500 hover:bg-gray-800/50 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
                title={session.name}
              >
                {session.name.charAt(0).toUpperCase()}
                
                {/* Mode indicators for collapsed view */}
                <div className="absolute -top-1 -right-1 flex flex-col space-y-0.5">
                  {(session.ragMessages && session.ragMessages.length > 0) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400" title="Has RAG messages" />
                  )}
                  {(session.dataSourcesMessages && session.dataSourcesMessages.length > 0) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Has Data Sources messages" />
                  )}
                  {(session.quantAgentMessages && session.quantAgentMessages.length > 0) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Has Quant Agent messages" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}