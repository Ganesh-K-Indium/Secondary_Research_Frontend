import React from "react";
import { useTheme } from "./context/ThemeContext";

function Lander({ onStartChat }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>

    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Creative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl opacity-40 ${isDark ? 'bg-gradient-to-r from-indigo-500/15 to-blue-500/15' : 'bg-gradient-to-r from-indigo-300/20 to-blue-300/20'}`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 rounded-full blur-2xl opacity-30 ${isDark ? 'bg-gradient-to-r from-purple-500/15 to-pink-500/15' : 'bg-gradient-to-r from-purple-300/20 to-pink-300/20'}`}></div>
        <div className={`absolute bottom-32 left-1/4 w-40 h-40 rounded-full blur-3xl opacity-25 ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10' : 'bg-gradient-to-r from-blue-200/20 to-indigo-200/20'}`}></div>
        <div className={`absolute top-1/3 right-10 w-20 h-20 transform rotate-45 opacity-20 ${isDark ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' : 'bg-gradient-to-r from-purple-300/20 to-blue-300/20'}`}></div>

        {/* Subtle grid pattern */}
        <div className={`absolute inset-0 ${isDark ? 'opacity-3' : 'opacity-5'}`}>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(${isDark ? '255,255,255' : '0,0,0'},${isDark ? '0.08' : '0.05'}) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Theme Toggle - Creative Top Right */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={toggleTheme}
          className={`relative group w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-indigo-500/50 shadow-lg shadow-indigo-500/5'
              : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 hover:border-indigo-400/50 shadow-lg shadow-indigo-300/10'
          }`}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {/* Animated background on hover */}
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            isDark
              ? 'bg-gradient-to-r from-indigo-500/10 to-blue-500/10'
              : 'bg-gradient-to-r from-indigo-100/30 to-blue-100/30'
          }`}></div>

          {/* Icon container with animation */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Sun icon - appears in light mode */}
            <div className={`absolute transition-all duration-500 transform ${
              isDark ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'
            }`}>
              <svg
  className="w-6 h-6 text-amber-400"
  fill="none"
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
            </div>

            {/* Moon icon - appears in dark mode */}
            <div className={`absolute transition-all duration-500 transform ${
              isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-180'
            }`}>
              <svg
  className="w-6 h-6 text-indigo-300"
  fill="currentColor"
  viewBox="0 0 24 24"
>
  <path d="M21.64 13.65A9 9 0 1110.35 2.36a7 7 0 1011.29 11.29z" />
</svg>
            </div>
          </div>

          {/* Glow effect on hover */}
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg ${
            isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/20'
          }`}></div>
        </button>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-block mb-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-float-slow shadow-2xl ${
                isDark 
                  ? 'bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 shadow-indigo-500/20'
                  : 'bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 shadow-indigo-400/25'
              }`}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth="2"
  d="M3 17l6-6 4 4 8-8M13 7h8v8"
/>
                </svg>
              </div>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span className={`bg-clip-text text-transparent animate-gradient-x ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400'
                  : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600'
              }`}>
                Investment Analyst Agent
              </span>
            </h1>

            <p className={`text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Experience intelligent conversations powered by advanced AI. Choose between enhanced responses from our <span className={`font-semibold transition-colors duration-500 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Secondary Research Agent</span>,
              managing multiple data sources, or comprehensive stock analysis with our <span className={`font-semibold transition-colors duration-500 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Quant Agent</span>.
            </p>
          </div>
          
          {/* Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Secondary Research Agent Card */}
            <div className={`group rounded-2xl p-8 backdrop-blur-sm flex flex-col h-full relative overflow-hidden transition-all duration-500 ${
              isDark
                ? 'bg-slate-900/40 border border-slate-800/40 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10'
                : 'bg-white border-2 border-indigo-200/60 shadow-lg shadow-indigo-200/20 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-300/30'
            }`}>
              {/* Card background effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-indigo-500/5 to-blue-500/5'
                  : 'bg-gradient-to-br from-indigo-100/20 to-blue-100/20'
              }`}></div>

              <div className="text-center flex-1 flex flex-col relative z-10">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/25 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {/* Subtle hover sparkles */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700" style={{transitionDelay: '0.1s'}}></div>
                </div>

                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 group-hover:transition-colors group-hover:duration-300 ${isDark ? 'text-indigo-300 group-hover:text-indigo-200' : 'text-indigo-600 group-hover:text-indigo-700'}`}>
                  Secondary Research Agent
                </h3>

                <p className={`mb-8 leading-relaxed flex-1 transition-colors duration-500 ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                  Advanced AI-powered secondary research agent for comprehensive analysis and insights with intelligent citations.
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => onStartChat("rag")}
                    className={`w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 hover:scale-105 transform group-hover:translate-y-[-2px] ${
                      isDark
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                    }`}
                  >
                    Start Secondary Research Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Data Sources Card */}
            <div className={`group rounded-2xl p-8 backdrop-blur-sm flex flex-col h-full relative overflow-hidden transition-all duration-500 ${
              isDark
                ? 'bg-slate-900/40 border border-slate-800/40 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10'
                : 'bg-white border-2 border-blue-200/60 shadow-lg shadow-blue-200/20 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-300/30'
            }`}>
              {/* Card background effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5'
                  : 'bg-gradient-to-br from-blue-100/20 to-cyan-100/20'
              }`}></div>

              <div className="text-center flex-1 flex flex-col relative z-10">
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg mx-auto ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 group-hover:shadow-blue-500/25'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 group-hover:shadow-blue-500/25'
                  }`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  {/* Subtle hover sparkles */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700" style={{transitionDelay: '0.1s'}}></div>
                </div>

                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 group-hover:transition-colors group-hover:duration-300 ${isDark ? 'text-blue-300 group-hover:text-blue-200' : 'text-blue-600 group-hover:text-blue-700'}`}>
                  Data Sources
                </h3>

                <p className={`mb-8 leading-relaxed flex-1 transition-colors duration-500 ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                  Manage and interact with multiple data sources including Jira, Confluence, SharePoint, and Google Drive through our intelligent multi-agent system.
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => onStartChat("dataSources")}
                    className={`w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 hover:scale-105 transform group-hover:translate-y-[-2px] ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                    }`}
                  >
                    Start Data Sources Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Quant Agent Card */}
            <div className={`group rounded-2xl p-8 backdrop-blur-sm flex flex-col h-full relative overflow-hidden transition-all duration-500 ${
              isDark
                ? 'bg-slate-900/40 border border-slate-800/40 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10'
                : 'bg-white border-2 border-purple-200/60 shadow-lg shadow-purple-200/20 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-300/30'
            }`}>
              {/* Card background effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-purple-500/5 to-pink-500/5'
                  : 'bg-gradient-to-br from-purple-100/20 to-pink-100/20'
              }`}></div>

              <div className="text-center flex-1 flex flex-col relative z-10">
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg mx-auto ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 group-hover:shadow-purple-500/25'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 group-hover:shadow-purple-500/25'
                  }`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  {/* Subtle hover sparkles */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700" style={{transitionDelay: '0.1s'}}></div>
                </div>

                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 group-hover:transition-colors group-hover:duration-300 ${isDark ? 'text-purple-300 group-hover:text-purple-200' : 'text-purple-600 group-hover:text-purple-700'}`}>
                  Quant Agent
                </h3>

                <p className={`mb-8 leading-relaxed flex-1 transition-colors duration-500 ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                  AI-powered stock analysis with fundamental analysis, technical indicators, and comprehensive investment insights.
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => onStartChat("quantAgent")}
                    className={`w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 hover:scale-105 transform group-hover:translate-y-[-2px] ${
                      isDark
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/25'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/25'
                    }`}
                  >
                    Start Quant Agent
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 lg:mt-20">
            <p className={`text-sm transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Built with advanced AI technology and secure data handling
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Lander;
