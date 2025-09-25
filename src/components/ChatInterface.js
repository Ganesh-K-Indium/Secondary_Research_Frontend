import React, { useState } from "react";
import { formatRagResponseForChat } from "../utils"; // Correct import

export default function ChatInterface({ serverUrl, mode, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      if (mode === "rag") {
  const res = await fetch(serverUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: input }),
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const data = await res.json();
  const { answer, related, citations } = formatRagResponseForChat(data);

  // Build display string
  let formattedText = answer;

  if (related.length > 0) {
    formattedText += `\n\n**Related Questions:**\n${related.join("\n")}`;
  }

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

  const botMessage = { sender: "bot", text: formattedText };
  setMessages((prev) => [...prev, botMessage]);
} else {
        const res = await fetch(`${serverUrl}?query=${encodeURIComponent(input)}`);
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let decoded = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          decoded += decoder.decode(value, { stream: true });
          const current = decoded; // safe closure

          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last && last.sender === "bot" && last.partial) {
              copy[copy.length - 1] = { sender: "bot", text: current, partial: true };
              return copy;
            } else {
              return [...copy, { sender: "bot", text: current, partial: true }];
            }
          });
        }

        // finalize
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last && last.sender === "bot") {
            copy[copy.length - 1] = { sender: "bot", text: decoded };
          }
          return copy;
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header with clear button */}
      {messages.length > 0 && (
        <div className="p-3 flex justify-end">
          <button
            onClick={clearChat}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white 
                     bg-gray-800/50 hover:bg-gray-700/50 rounded-xl 
                     transition-all duration-200 flex items-center space-x-2
                     border border-gray-700/50 hover:border-gray-600/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear Chat</span>
          </button>
        </div>
      )}

      {/* Chat messages container with gradient background */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        {messages.length === 0 ? (
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
          messages.map((msg, idx) => (
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
                {msg.text.split('\n\n').map((block, blockIdx) => {
                  if (block.startsWith('**Related Questions:**')) {
                    return (
                      <div key={blockIdx} className="mt-4 pt-3 border-t border-gray-600/30">
                        <div className="font-semibold mb-2 text-gray-300">Related Questions:</div>
                        <div className="space-y-1 pl-2">
                          {block.replace('**Related Questions:**', '').trim().split('\n').map((question, qIdx) => (
                            <div key={qIdx} className="text-gray-200">
                              {question}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  } else if (block.startsWith('**Citations:**')) {
                    return (
                      <div key={blockIdx} className="mt-4 pt-3 border-t border-gray-600/30">
                        <div className="font-semibold mb-2 text-gray-300">Citations:</div>
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
                    return (
                      <div key={blockIdx} className={blockIdx > 0 ? 'mt-3' : ''}>
                        {block}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-xl max-w-lg bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg border border-gray-600/30" 
                 style={{ maxWidth: "85%" }}>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">AI Assistant</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: "300ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
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