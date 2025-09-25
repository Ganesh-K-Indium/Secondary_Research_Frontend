import React from "react";

export default function Navbar({ currentChat, setCurrentChat }) {
  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left section: Back button and title */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setCurrentChat(null)}
              className="group relative flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-all duration-200"
            >
              <div className="relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-150" />
              </div>
              <span className="relative z-10 text-sm font-medium tracking-wide">Back</span>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-gray-800/50 to-transparent blur-xl" />
            </button>

            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Secondary Research Agent
              </h1>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
                <span className="text-sm font-medium text-gray-400 tracking-wide">
                  {currentChat === "rag" ? "Knowledge Search" : "Knowledge Input"}
                </span>
              </div>
            </div>
          </div>

          {/* Right section: Modern toggle buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentChat("rag")}
              className="group relative"
            >
              <div className={`px-5 py-2.5 rounded-xl flex items-center space-x-3 transition-all duration-300 
                ${currentChat === "rag" 
                  ? "bg-gradient-to-r from-teal-500/90 to-teal-600/90 shadow-lg shadow-teal-500/20" 
                  : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300
                  ${currentChat === "rag" 
                    ? "bg-teal-400/20" 
                    : "bg-gray-700/50 group-hover:bg-gray-600/50"}`}>
                  <svg className={`w-4 h-4 ${currentChat === "rag" ? "text-white" : "text-gray-400 group-hover:text-white"}`} 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className={`text-sm font-medium tracking-wide ${
                  currentChat === "rag" ? "text-white" : "text-gray-400 group-hover:text-white"
                }`}>RAG Chat</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentChat("ingestion")}
              className="group relative"
            >
              <div className={`px-5 py-2.5 rounded-xl flex items-center space-x-3 transition-all duration-300 
                ${currentChat === "ingestion" 
                  ? "bg-gradient-to-r from-teal-500/90 to-teal-600/90 shadow-lg shadow-teal-500/20" 
                  : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300
                  ${currentChat === "ingestion" 
                    ? "bg-teal-400/20" 
                    : "bg-gray-700/50 group-hover:bg-gray-600/50"}`}>
                  <svg className={`w-4 h-4 ${currentChat === "ingestion" ? "text-white" : "text-gray-400 group-hover:text-white"}`} 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className={`text-sm font-medium tracking-wide ${
                  currentChat === "ingestion" ? "text-white" : "text-gray-400 group-hover:text-white"
                }`}>Ingestion</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
