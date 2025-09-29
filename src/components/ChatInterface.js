import React, { useState, useEffect, useRef, useMemo } from "react";
import { formatRagResponseForChat } from "../utils"; // Correct import
import { exportChatHistory } from "../utils/logger"; // Import logger utilities

export default function ChatInterface({ serverUrl, mode, messages, setMessages, sessionId, onSessionUpdate, getUserId }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const messagesEndRef = useRef(null);

  // Ensure messages is always an array
  const safeMessages = useMemo(() => messages || [], [messages]);

  // Loading messages that rotate during processing
  const loadingMessages = mode === 'rag' ? [
    "Searching knowledge base",
    "Analyzing your question",
    "Finding relevant information",
    "Processing documents",
    "Preparing detailed response",
    "Almost ready"
  ] : [
    "Processing your input",
    "Analyzing content structure",
    "Extracting key information",
    "Organizing data points",
    "Finalizing ingestion",
    "Almost complete"
  ];

  // Rotate loading messages every 2 seconds
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, loadingMessages.length]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages]);

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
        // Get user ID for the request
        const userId = getUserId ? getUserId() : `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const requestPayload = {
          query: input,
          user_id: userId,
          extra_inputs: {} // Can be extended for additional inputs
        };

        const res = await fetch(serverUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        
        // Debug logging for new API response
        console.log('RAG API Response:', {
          routing_decision: data.routing_decision,
          documents_used: data.documents_used,
          session_info: data.session_info,
          answer_type: typeof data.answer,
          citations_count: data.citations?.length || 0,
          documents_count: data.documents?.length || 0
        });
        
        // Use the updated formatting function
        const { answer, citations, documents, performance, session_info } = formatRagResponseForChat(data);
        
        // Fallback error handling
        if (!answer) {
          console.warn('No answer found in response:', data);
          const fallbackAnswer = "I apologize, but I couldn't process your request properly. Please try again.";
          const errorMessage = { 
            sender: "bot", 
            text: fallbackAnswer,
            timestamp: Date.now(),
            metadata: { error: true }
          };
          const errorMessages = [...updatedMessages, errorMessage];
          setMessages(errorMessages);
          if (sessionId && onSessionUpdate) {
            onSessionUpdate(sessionId, errorMessages, mode);
          }
          return;
        }

        // Build formatted response with comprehensive information
        let formattedText = answer;

        // Add performance information for transparency
        if (performance.routing_decision !== 'unknown') {
          console.log(`Query processed via: ${performance.routing_decision}`);
          console.log(`Documents analyzed: ${performance.documents_used}`);
          console.log('Performance metrics:', performance.performance_metrics);
        }

        // Add documents section if available
        if (documents.length > 0) {
          formattedText += `\n\n**📄 Documents Analyzed (${documents.length}):**\n`;
          documents.slice(0, 3).forEach((doc, idx) => { // Show max 3 documents
            formattedText += `\n${idx + 1}. **${doc.source}**`;
            if (doc.metadata?.page) {
              formattedText += ` (Page ${doc.metadata.page})`;
            }
            if (doc.content && doc.content.length > 0) {
              const preview = doc.content.length > 150 ? 
                doc.content.substring(0, 150) + "..." : doc.content;
              formattedText += `\n   *${preview}*`;
            }
          });
          if (documents.length > 3) {
            formattedText += `\n   *...and ${documents.length - 3} more documents*`;
          }
        }

        // Add citations section with enhanced information
        if (citations.length > 0) {
          formattedText += `\n\n**📚 Sources & Citations:**\n`;
          const uniqueCitations = citations.filter((citation, index, self) => 
            index === self.findIndex(c => c.file === citation.file && c.page === citation.page)
          );
          
          uniqueCitations.forEach((citation, idx) => {
            formattedText += `\n**${idx + 1}. ${citation.file}**`;
            if (citation.page) {
              formattedText += ` (Page ${citation.page})`;
            }
            if (citation.content && citation.content.trim()) {
              formattedText += `\n   *"${citation.content}"*`;
            }
            if (citation.image) {
              formattedText += `\n   📷 [Image Reference](${citation.image})`;
            }
          });
        }

        // Add cross-reference analysis if available
        if (performance.cross_reference_analysis && 
            Object.keys(performance.cross_reference_analysis).length > 0) {
          console.log('Cross-reference analysis:', performance.cross_reference_analysis);
        }

        // Add tool calls information if available
        if (performance.tool_calls && performance.tool_calls.length > 0) {
          console.log(`Tools used: ${performance.tool_calls.join(', ')}`);
        }

        const botMessage = { 
          sender: "bot", 
          text: formattedText,
          timestamp: Date.now(),
          metadata: {
            routing_decision: performance.routing_decision,
            documents_used: performance.documents_used,
            session_info: session_info,
            performance: performance,
            citations_count: citations.length,
            documents_count: documents.length
          }
        };
        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);
        
        // Update session with bot response
        if (sessionId && onSessionUpdate) {
          onSessionUpdate(sessionId, finalMessages, mode);
        }
} else {
        try {
          // For ingestion, we might also want to include user_id in the future
          // const userId = getUserId ? getUserId() : `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const res = await fetch(`${serverUrl}?query=${encodeURIComponent(input)}`);
          
          if (!res.ok) {
            throw new Error(`Ingestion server error: ${res.status}`);
          }
          
          const reader = res.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let decoded = "";
          
          // Add initial bot message for streaming
          const initialBotMessage = { sender: "bot", text: "Processing...", partial: true, timestamp: Date.now() };
          const messagesWithBot = [...updatedMessages, initialBotMessage];
          
          setMessages(messagesWithBot);
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            decoded += decoder.decode(value, { stream: true });

            // Update the last bot message with streaming content
            setMessages([...updatedMessages, { sender: "bot", text: decoded, partial: true, timestamp: Date.now() }]);
          }

          // finalize the response
          const finalMessages = [...updatedMessages, { sender: "bot", text: decoded, timestamp: Date.now() }];
          
          setMessages(finalMessages);
          
          // Update session with final response
          if (sessionId && onSessionUpdate) {
            onSessionUpdate(sessionId, finalMessages, mode);
          }
        } catch (streamError) {
          console.error('Streaming error:', streamError);
          throw streamError;
        }


      }
    } catch (err) {
      const errorMessage = { 
        sender: "bot", 
        text: `Error connecting to server: ${err.message}`,
        timestamp: Date.now()
      };
      const errorMessages = [...updatedMessages, errorMessage];
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
    <div className="flex flex-col h-full">
      <style>
        {`
          @keyframes opacity-fade {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
      {/* Enhanced Chatbot Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Bot info */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                {mode === 'rag' ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {mode === 'rag' ? 'Knowledge Assistant' : 'Knowledge Contributor'}
              </h2>
              <p className="text-xs text-gray-400">
                {mode === 'rag' ? 'Search & Discover Information' : 'Share & Build Knowledge'}
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {safeMessages.length > 0 && (
              <>
                <button
                  onClick={() => exportChatHistory(safeMessages, mode)}
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white 
                           bg-gray-700/50 hover:bg-gray-600/50 rounded-lg 
                           transition-all duration-200 flex items-center space-x-2
                           border border-gray-600/30 hover:border-gray-500/50"
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
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white 
                           bg-gray-700/50 hover:bg-gray-600/50 rounded-lg 
                           transition-all duration-200 flex items-center space-x-2
                           border border-gray-600/30 hover:border-gray-500/50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear</span>
                </button>
              </>
            )}
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages container with gradient background */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        {safeMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-2xl shadow-lg 
                          border border-gray-600/30 max-w-2xl w-full backdrop-blur-sm">
              <div className="flex justify-center mb-6">
                {mode === 'rag' ? (
                  <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-4">
                {mode === 'rag' ? 'Knowledge Base Search' : 'Knowledge Contribution'}
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                {mode === 'rag' 
                  ? 'Access information from the knowledge base by asking questions. Get accurate answers with relevant citations.'
                  : 'Contribute to the knowledge base through natural conversation. Share insights and information to help improve the system.'}
              </p>
              <div className="text-sm text-gray-400 flex items-center justify-center space-x-2">
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
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-xl max-w-lg break-words backdrop-blur-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white self-end ml-auto shadow-lg"
                  : "bg-gradient-to-r from-gray-700 to-gray-600 text-white self-start mr-auto shadow-lg border border-gray-600/30"
              }`}
              style={{
                maxWidth: "85%",
                position: "relative"
              }}
            >
              <div className="text-sm mb-1">
                {msg.sender === "user" ? (
                  <span className="text-teal-100">You</span>
                ) : (
                  <span className="text-gray-300">AI Assistant</span>
                )}
              </div>
              <div className="text-base leading-relaxed">
                {mode === 'ingestion' && msg.sender === 'bot' ? (
                  // Special handling for ingestion streaming responses
                  <div className="whitespace-pre-wrap ">
                    {msg.text}
                  </div>
                ) : (
                  // Normal handling for RAG responses with markdown-like formatting
                  msg.text.split('\n\n').map((block, blockIdx) => {
                    if (block.startsWith('**Citations:**')) {
                      return (
                        <div key={blockIdx} className="mt-4 pt-3 border-t border-gray-600/30">
                          <div className="whitespace-pre-wrap font-semibold mb-2 text-gray-300">Citations:</div>
                          <div className="space-y-2 pl-2">
                            {block.replace('**Citations:**', '').trim().split('\n').map((citation, cIdx) => (
                              <div key={cIdx} className="text-gray-200 text-sm">
                                {citation}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      // Enhanced markdown formatting for polished content
                      const lines = block.split('\n');
                      const formattedLines = lines.map((line, lineIdx) => {
                        // Handle bullet points
                        if (line.match(/^\s*[-•*]\s+/)) {
                          const content = line.replace(/^\s*[-•*]\s+/, '');
                          const formattedContent = content
                            .split(/(\*\*[^*]+\*\*)/g)
                            .map((part, partIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong key={partIdx} className="font-semibold text-white">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return part;
                            });
                          return (
                            <div key={lineIdx} className="flex items-start space-x-2 mb-1">
                              <span className="text-teal-400 mt-1 flex-shrink-0">•</span>
                              <span>{formattedContent}</span>
                            </div>
                          );
                        }
                        
                        // Handle numbered lists
                        if (line.match(/^\s*\d+\.\s+/)) {
                          const match = line.match(/^\s*(\d+)\.\s+(.+)/);
                          if (match) {
                            const [, number, content] = match;
                            const formattedContent = content
                              .split(/(\*\*[^*]+\*\*)/g)
                              .map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong key={partIdx} className="font-semibold text-white">
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              });
                            return (
                              <div key={lineIdx} className="flex items-start space-x-2 mb-1">
                                <span className="text-teal-400 font-medium flex-shrink-0">{number}.</span>
                                <span>{formattedContent}</span>
                              </div>
                            );
                          }
                        }
                        
                        // Handle regular text with bold formatting
                        const formattedLine = line
                          .split(/(\*\*[^*]+\*\*)/g)
                          .map((part, partIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={partIdx} className="font-semibold text-white">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          });
                        
                        return (
                          <div key={lineIdx} className={line.trim() ? 'mb-1' : 'mb-2'}>
                            {formattedLine}
                          </div>
                        );
                      });
                      
                      return (
                        <div key={blockIdx} className={blockIdx > 0 ? 'mt-4' : ''}>
                          {formattedLines}
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </div>
          </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-xl max-w-lg bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg border border-gray-600/30" 
                 style={{ maxWidth: "85%" }}>
              <div className="text-sm mb-2">
                <span className="text-gray-300">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="min-w-0 flex-1">
                  <div className="text-base leading-relaxed text-white transition-opacity duration-500">
                    {loadingMessages[loadingMessageIndex]}
                  </div>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-teal-400" 
                       style={{ 
                         animation: "opacity-fade 1.5s ease-in-out infinite",
                         animationDelay: "0ms"
                       }}></div>
                  <div className="w-2 h-2 rounded-full bg-teal-400" 
                       style={{ 
                         animation: "opacity-fade 1.5s ease-in-out infinite",
                         animationDelay: "500ms"
                       }}></div>
                  <div className="w-2 h-2 rounded-full bg-teal-400" 
                       style={{ 
                         animation: "opacity-fade 1.5s ease-in-out infinite",
                         animationDelay: "1000ms"
                       }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box fixed at bottom */}
      <div className="p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-transparent text-gray-100 
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={`Type your message${mode === 'rag' ? ' to search knowledge base' : ' to contribute knowledge'}...`}
              disabled={loading}
            />
          </div>
          <button
            onClick={sendMessage}
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
              loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400"
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