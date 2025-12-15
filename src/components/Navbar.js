import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ currentChat, setCurrentChat, currentSession, onNewSession }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <nav className={`bg-white dark:bg-slate-950 border-b transition-colors duration-500 relative ${isDark ? 'border-slate-800/40' : 'border-gray-200/50'}`}>
      
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Back button and title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentChat(null)}
              className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-500 border
                       ${isDark 
                         ? 'bg-slate-900/50 hover:bg-slate-800/50 border-slate-800/50 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-400' 
                         : 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-indigo-400 text-gray-700 hover:text-indigo-600'}`}
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
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="hidden md:block">
                  <h1 className={`text-lg font-bold transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Investment Analyst Agent
                  </h1>
                </div>
              </div>
              <div className="hidden lg:flex items-center space-x-3">
                {/* Session info */}
                {currentSession && (
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors duration-500 ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-800/50' 
                      : 'bg-gray-100 border-gray-200'
                  }`}>
                    <div className="flex space-x-1">
                      {(currentSession.ragMessages && currentSession.ragMessages.length > 0) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400" title="Has Secondary Research messages" />
                      )}
                      {(currentSession.dataSourcesMessages && currentSession.dataSourcesMessages.length > 0) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Has Data Sources messages" />
                      )}
                      {(currentSession.quantAgentMessages && currentSession.quantAgentMessages.length > 0) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Has Quant Agent messages" />
                      )}
                      {(!currentSession.ragMessages || currentSession.ragMessages.length === 0) && 
                       (!currentSession.dataSourcesMessages || currentSession.dataSourcesMessages.length === 0) &&
                       (!currentSession.quantAgentMessages || currentSession.quantAgentMessages.length === 0) && (
                        <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} title="Empty session" />
                      )}
                    </div>
                    <span className={`text-xs truncate max-w-32 transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                      {currentSession.name}
                    </span>
                  </div>
                )}
                
                {/* New session button */}
                <button
                  onClick={onNewSession}
                  className={`flex items-center space-x-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-500 border
                           ${isDark
                             ? 'bg-slate-900/50 hover:bg-slate-800/50 border-slate-800/50 hover:border-indigo-500/50 text-gray-400 hover:text-white'
                             : 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-indigo-400 text-gray-700 hover:text-gray-900'}`}
                  title="New Session"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden xl:inline">New</span>
                </button>
                
                <div className={`h-6 w-px transition-colors duration-500 ${isDark ? 'bg-slate-800/50' : 'bg-gray-300/50'}`}></div>
                <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border transition-colors duration-500 ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800/50'
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className={`text-xs font-medium tracking-wide transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    {currentChat === "rag" ? "Secondary Research" : currentChat === "dataSources" ? "Data Sources" : currentChat === "quantAgent" ? "Quant Agent" : "Ready"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right section: Compact mode toggle buttons */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center rounded-xl p-0.5 border transition-colors duration-500 ${
              isDark
                ? 'bg-slate-900/50 border-slate-800/50'
                : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                onClick={() => setCurrentChat("rag")}
                className="group relative"
              >
                <div className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-500 relative z-10
                  ${currentChat === "rag" 
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-500/25 text-white" 
                    : isDark 
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-500
                    ${currentChat === "rag" 
                      ? "bg-white/20 shadow-sm" 
                      : isDark
                        ? "bg-slate-800/50 group-hover:bg-slate-700/50"
                        : "bg-white group-hover:bg-gray-200"}`}>
                    <svg className="w-3.5 h-3.5 transition-colors duration-500" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-semibold tracking-wide">Secondary</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCurrentChat("dataSources")}
                className="group relative"
              >
                <div className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-500 relative z-10
                  ${currentChat === "dataSources" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 text-white" 
                    : isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-500
                    ${currentChat === "dataSources" 
                      ? "bg-white/20 shadow-sm" 
                      : isDark
                        ? "bg-slate-800/50 group-hover:bg-slate-700/50"
                        : "bg-white group-hover:bg-gray-200"}`}>
                    <svg className="w-3.5 h-3.5 transition-colors duration-500" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-semibold tracking-wide">Data Sources</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCurrentChat("quantAgent")}
                className="group relative"
              >
                <div className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-500 relative z-10
                  ${currentChat === "quantAgent" 
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 text-white" 
                    : isDark
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-500
                    ${currentChat === "quantAgent" 
                      ? "bg-white/20 shadow-sm" 
                      : isDark
                        ? "bg-slate-800/50 group-hover:bg-slate-700/50"
                        : "bg-white group-hover:bg-gray-200"}`}>
                    <svg className="w-3.5 h-3.5 transition-colors duration-500" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-semibold tracking-wide">Quant</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Theme Toggle Button */}
            {/* Theme Toggle Button */}
<button
  onClick={toggleTheme}
  className={`relative flex items-center justify-center p-2 rounded-lg transition-all duration-500 border overflow-hidden
    ${isDark
      ? 'bg-slate-900/50 hover:bg-slate-800/50 border-slate-800/50 hover:border-indigo-500/50 text-indigo-300'
      : 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-indigo-400 text-indigo-500'}
  `}
  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {/* Animated background glow */}
  <div
    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
      isDark ? 'bg-indigo-500/10' : 'bg-indigo-400/10'
    }`}
  ></div>

  {/* Sun Icon */}
  <svg
    className={`w-5 h-5 transition-all duration-500 transform ${
      isDark
        ? 'opacity-0 scale-0 rotate-180'
        : 'opacity-100 scale-100 rotate-0'
    }`}
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="4" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.36-7.36-1.42 1.42M7.05 16.95l-1.42 1.42m12.73 0-1.42-1.42M7.05 7.05 5.64 5.64"
    />
  </svg>

  {/* Moon Icon */}
  <svg
    className={`w-5 h-5 absolute transition-all duration-500 transform ${
      isDark
        ? 'opacity-100 scale-100 rotate-0'
        : 'opacity-0 scale-0 rotate-180'
    }`}
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path d="M21.64 13.65A9 9 0 1110.35 2.36a7 7 0 1011.29 11.29z" />
  </svg>
</button>


          </div>
        </div>
      </div>
    </nav>
  );
}
