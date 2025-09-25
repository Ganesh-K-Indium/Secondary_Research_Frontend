import React from "react";

export default function Navbar({ currentChat, setCurrentChat, currentSession, onNewSession }) {
  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 border-b border-gray-700/50 backdrop-blur-lg relative">
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Back button and title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentChat(null)}
              className="group relative flex items-center space-x-2 px-3 py-2 rounded-lg
                       bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/30 hover:border-gray-600/50
                       text-gray-400 hover:text-teal-400 transition-all duration-300 backdrop-blur-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs font-medium tracking-wide hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    Research Agent
                  </h1>
                </div>
              </div>
              <div className="hidden lg:flex items-center space-x-3">
                {/* Session info */}
                {currentSession && (
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <div className="flex space-x-1">
                      {(currentSession.ragMessages && currentSession.ragMessages.length > 0) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400" title="Has RAG messages" />
                      )}
                      {(currentSession.ingestionMessages && currentSession.ingestionMessages.length > 0) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Has Ingestion messages" />
                      )}
                      {(!currentSession.ragMessages || currentSession.ragMessages.length === 0) && 
                       (!currentSession.ingestionMessages || currentSession.ingestionMessages.length === 0) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title="Empty session" />
                      )}
                    </div>
                    <span className="text-xs text-gray-300 truncate max-w-32">
                      {currentSession.name}
                    </span>
                  </div>
                )}
                
                {/* New session button */}
                <button
                  onClick={onNewSession}
                  className="flex items-center space-x-1 px-2 py-1.5 text-xs text-gray-400 hover:text-white 
                           bg-gray-700/50 hover:bg-gray-600/50 rounded-lg 
                           transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
                  title="New Session"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden xl:inline">New</span>
                </button>
                
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
                <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-300 tracking-wide">
                    {currentChat === "rag" ? "Search" : currentChat === "ingestion" ? "Input" : "Ready"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right section: Compact mode toggle buttons */}
          <div className="flex items-center">
            <div className="flex items-center bg-gray-800/30 rounded-xl p-0.5 border border-gray-700/30 backdrop-blur-sm shadow-lg">
              <button
                onClick={() => setCurrentChat("rag")}
                className="group relative"
              >
                <div className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 relative z-10
                  ${currentChat === "rag" 
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg shadow-teal-500/25 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300
                    ${currentChat === "rag" 
                      ? "bg-white/20 shadow-sm" 
                      : "bg-gray-700/50 group-hover:bg-gray-600/50"}`}>
                    <svg className={`w-3.5 h-3.5 transition-colors duration-300`} 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-semibold tracking-wide">RAG</span>
                  </div>
                </div>
                {currentChat === "rag" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-lg blur-lg scale-110"></div>
                )}
              </button>

              <button
                onClick={() => setCurrentChat("ingestion")}
                className="group relative"
              >
                <div className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 relative z-10
                  ${currentChat === "ingestion" 
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg shadow-teal-500/25 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300
                    ${currentChat === "ingestion" 
                      ? "bg-white/20 shadow-sm" 
                      : "bg-gray-700/50 group-hover:bg-gray-600/50"}`}>
                    <svg className={`w-3.5 h-3.5 transition-colors duration-300`} 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-semibold tracking-wide">Input</span>
                  </div>
                </div>
                {currentChat === "ingestion" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-lg blur-lg scale-110"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
