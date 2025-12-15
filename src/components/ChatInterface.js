import React, { useState, useEffect, useRef, useMemo } from "react";
import { formatRagResponseForChat } from "../utils"; // Correct import
import { exportChatHistory } from "../utils/logger"; // Import logger utilities
import TypedResponse from "./TypedResponse";
import LoadingAnimation from "./LoadingAnimation";
import { useTheme } from "../context/ThemeContext";

export default function ChatInterface({ serverUrl, mode, messages, setMessages, sessionId, onSessionUpdate }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { isDark } = useTheme();

  // Ensure messages is always an array
  const safeMessages = useMemo(() => messages || [], [messages]);

  // Enhanced auto-scroll to bottom with better timing for large message lists
  const scrollToBottom = (immediate = false) => {
    const scroll = () => {
      if (messagesContainerRef.current) {
        // Scroll the container with smooth behavior for better fluidity
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    };

    if (immediate) {
      // For new messages being added, scroll immediately with smooth motion
      requestAnimationFrame(scroll);
    } else {
      // For initial load of old chats, wait longer to ensure all messages are rendered
      requestAnimationFrame(() => {
        setTimeout(scroll, 100);
      });
    }
  };

  // Auto-scroll when messages change (immediate for new messages, delayed for loaded sessions)
  useEffect(() => {
    const isInitialLoad = safeMessages.length > 0 && !loading;
    scrollToBottom(!isInitialLoad);
  }, [safeMessages]);

  // Auto-scroll when loading state changes (response incoming)
  useEffect(() => {
    if (!loading) {
      // Scroll after loading finishes to show the complete response
      const scrollTimer = setTimeout(() => scrollToBottom(true), 50);
      return () => clearTimeout(scrollTimer);
    }
  }, [loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      sender: "user", 
      text: input,
      timestamp: Date.now()
    };
    const updatedMessages = [...safeMessages, userMessage];
    
    // Update parent state immediately
    setMessages(updatedMessages);
    
    // Update session with new user message
    if (sessionId && onSessionUpdate) {
      onSessionUpdate(sessionId, updatedMessages, mode);
    }
    
    setInput("");
    setLoading(true);

    try {
      if (mode === "rag") {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000);

        const res = await fetch(serverUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            query: input,
            thread_id: sessionId 
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const data = await res.json();
  const { answer, citations} = formatRagResponseForChat(data);

  // Build display string - show answer, citations, and document metadata
  let formattedText = answer; 
 
  // Only add citations section if we have valid citations with content
  if (citations.length > 0 && citations.some(c => c.file)) {
    formattedText += `\n\n**Citations:**\n`;
    citations.forEach((c, idx) => {
      if (c.file) {
        formattedText += `\n${idx + 1}. ${c.file}`;
        if (c.page) formattedText += ` (Page ${c.page})`;
        if (c.image) formattedText += `\n   📷 Image: ${c.image}`;
      }
    });
  }

  // Add document metadata section if available
  /*if (documentMetadata && documentMetadata.length > 0) {
    documentMetadata.forEach((doc) => {
      formattedText += `\n\n### Document ${doc.index}\n**Metadata:**\n\`\`\`json\n${JSON.stringify(doc.metadata, null, 2)}\n\`\`\``;
    });
  }*/

  const botMessage = { 
    sender: "bot", 
    text: formattedText,
    timestamp: Date.now()
  };
  const finalMessages = [...updatedMessages, botMessage];
  setMessages(finalMessages);
  
  // Update session with bot response
  if (data.thread_id && data.thread_id !== sessionId && onSessionUpdate) {
    // If new thread_id returned, update it
    onSessionUpdate(data.thread_id, finalMessages, mode);
  } else if (sessionId && onSessionUpdate) {
    onSessionUpdate(sessionId, finalMessages, mode);
  }
} else {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 90000);

          const res = await fetch(serverUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              message: input,
              session_id: sessionId 
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          
          if (!res.ok) {
            throw new Error(`Chat server error: ${res.status}`);
          }
          
          const data = await res.json();
          
          if (!data.success) {
            throw new Error("Chat request failed");
          }
          
          const botMessage = { 
            sender: "bot", 
            text: data.response,
            timestamp: Date.now()
          };
          const finalMessages = [...updatedMessages, botMessage];
          setMessages(finalMessages);
          
          // Update session with bot response
          if (data.session_id && data.session_id !== sessionId && onSessionUpdate) {
            // If new session_id returned, update it
            onSessionUpdate(data.session_id, finalMessages, mode);
          } else if (sessionId && onSessionUpdate) {
            onSessionUpdate(sessionId, finalMessages, mode);
          }
        } catch (chatError) {
          console.error('Chat error:', chatError);
          throw chatError;
        }


      }
    } catch (err) {
      // Generate mode-specific error messages
      let errorMessage = '';
      
      if (err.name === 'AbortError') {
        errorMessage = ' Request timed out after 90 seconds. Please check your connection and try again.';
      } else if (err.message.includes('Failed to fetch')) {
        // Provide specific error based on mode
        if (mode === 'rag') {
          errorMessage = ' Secondary Research Agent is currently unavailable. Please try again in a moment.';
        } else if (mode === 'dataSources') {
          errorMessage = ' Data Sources service is not responding. Please verify your connection and try again.';
        } else if (mode === 'quantAgent') {
          errorMessage = ' Quant Agent service is temporarily unavailable. Please try again shortly.';
        } else {
          errorMessage = ' Unable to connect to the server. Please check your internet connection.';
        }
      } else if (err.message.includes('Chat server error') || err.message.includes('Server error')) {
        if (mode === 'rag') {
          errorMessage = ' Secondary Research Agent encountered an error. Please try your query again.';
        } else if (mode === 'dataSources') {
          errorMessage = ' Data Sources service encountered an error. Please try again.';
        } else if (mode === 'quantAgent') {
          errorMessage = ' Quant Agent encountered an error. Please try again.';
        } else {
          errorMessage = `Server error (${err.message}). Please try again.`;
        }
      } else if (err.message.includes('failed')) {
        if (mode === 'rag') {
          errorMessage = ' Secondary Research request failed. Please try again with a different query.';
        } else if (mode === 'dataSources') {
          errorMessage = ' Data Sources request failed. Please verify your data sources are accessible.';
        } else if (mode === 'quantAgent') {
          errorMessage = ' Quant Agent analysis request failed. Please try with different parameters.';
        } else {
          errorMessage = 'Request failed. Please try again.';
        }
      } else {
        errorMessage = ` ${err.message || 'An unexpected error occurred. Please try again.'}`;
      }
      
      const botMessage = { 
        sender: "bot", 
        text: errorMessage,
        timestamp: Date.now()
      };
      const errorMessages = [...updatedMessages, botMessage];
      setMessages(errorMessages);
      
      // Update session with error message
      if (sessionId && onSessionUpdate) {
        onSessionUpdate(sessionId, errorMessages, mode);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = (event) => {
    // Prevent any default browser behavior or event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Clear messages immediately
    setMessages([]);
    
    // Update session with empty messages for this mode only
    if (sessionId && onSessionUpdate) {
      onSessionUpdate(sessionId, [], mode);
    }
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-black text-gray-100' : 'bg-white text-gray-900'}`}>
      <style>
        {`
          @keyframes opacity-fade {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
      {/* Enhanced Chatbot Header */}
      <div className={`border-b px-6 py-4 ${isDark ? 'bg-slate-950 border-slate-800/40' : 'bg-white border-gray-200/50'}`}>
        <div className="flex items-center justify-between">
          {/* Left side - Bot info */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
                {mode === 'rag' ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ) : mode === 'dataSources' ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mode === 'rag' ? 'Secondary Research Agent' : mode === 'dataSources' ? 'Source Convergence Point' : 'Quant Agent'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                {mode === 'rag' ? 'Advanced Secondary Research & Analysis' : mode === 'dataSources' ? 'Where All Data Sources Converge' : 'Stock & Investment Analysis'}
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {safeMessages.length > 0 && (
              <>
              <button
                  onClick={() => exportChatHistory(safeMessages, mode)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-500 flex items-center space-x-2 border
                           ${isDark
                             ? 'bg-slate-900/50 hover:bg-slate-800/50 border-slate-800/50 hover:border-indigo-500/50 text-gray-400 hover:text-white'
                             : 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-indigo-400 text-gray-600 hover:text-gray-900'}`}
                  title="Export chat history as Markdown"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export</span>
                </button>
                <button
                  onClick={clearChat}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-500 flex items-center space-x-2 border
                           ${isDark
                             ? 'bg-slate-900/50 hover:bg-slate-800/50 border-slate-800/50 hover:border-red-500/50 text-gray-400 hover:text-white'
                             : 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-red-400 text-gray-600 hover:text-gray-900'}`}
                  title="Clear chat history"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear</span>
                </button>
              </>
            )}
            <div className={`flex items-center space-x-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages container with gradient background */}
      <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        {safeMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className={`p-8 rounded-2xl shadow-lg border max-w-2xl w-full backdrop-blur-sm ${
              isDark
                ? 'bg-slate-950/50 border-slate-800/40'
                : 'bg-white border-gray-200/30'
            }`}>
              <div className="flex justify-center mb-6">
                {mode === 'rag' ? (
                  <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ) : mode === 'dataSources' ? (
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent mb-4">
                {mode === 'rag' ? 'Secondary Research Agent' : mode === 'dataSources' ? 'Data Source Operations' : 'Investment AI Analyst'}
              </h3>
              <p className={`mb-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                {mode === 'rag' 
                  ? 'Advanced secondary research and analysis powered by AI. Ask questions to access comprehensive information with relevant citations and insights.'
                  : mode === 'dataSources'
                  ? 'Manage and coordinate operations across multiple data sources. Interact with Jira, Confluence, SharePoint, Google Drive, and more through our intelligent multi-agent system.'
                  : 'Get AI-powered stock analysis and investment insights. Ask about stock performance, market trends, financial metrics, and investment recommendations.'}
              </p>
              <div className={`text-sm flex items-center justify-center space-x-2 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Type your message below to begin</span>
              </div>
            </div>
          </div>
        ) : (
          safeMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              {msg.sender === "user" ? (
                // User message
                <div className={`px-4 py-3 rounded-2xl text-white shadow-lg shadow-indigo-500/30 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl break-words bg-gradient-to-r from-indigo-600 to-indigo-500`}>
                  <p className="text-sm font-medium text-indigo-100 mb-1">You</p>
                  <p className="text-base">{msg.text}</p>
                </div>
              ) : (
                // Bot message with streaming typed response
                <div className={`px-4 py-3 rounded-2xl text-sm shadow-lg border max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800/50 text-gray-100'
                    : 'bg-white border-gray-200/50 text-gray-900'
                }`}>
                  <p className={`text-xs font-medium mb-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>AI Assistant</p>
                  <div className={`text-base ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                    <TypedResponse content={msg.text} isComplete={true} />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {loading && <LoadingAnimation />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box fixed at bottom */}
      <div className={`p-4 border-t ${isDark ? 'bg-black border-slate-800/40' : 'bg-gray-50 border-gray-200/50'}`}>
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className={`flex-1 rounded-xl border ${
            isDark
              ? 'bg-slate-900/50 border-slate-800/40'
              : 'bg-white border-gray-200/50'
          }`}>
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-xl bg-transparent focus:outline-none focus:ring-2 transition-colors duration-200 ${
                isDark
                  ? 'text-gray-100 placeholder-gray-400 focus:ring-indigo-500/50'
                  : 'text-gray-900 placeholder-gray-500 focus:ring-indigo-400/50'
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={`Type your message${mode === 'rag' ? ' for secondary research' : mode === 'dataSources' ? ' to contribute knowledge' : ' to analyze stocks'}...`}
              disabled={loading}
            />
          </div>
          <button
            onClick={sendMessage}
            className={`p-3 rounded-xl transition-all duration-500 flex items-center justify-center shadow-lg ${
              loading
                ? isDark
                  ? "bg-slate-800/50 text-gray-600 cursor-not-allowed"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isDark
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-500/30"
                  : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-500/30"
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}