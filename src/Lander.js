import React from "react";

function Lander({ onStartChat }) {
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
      `}</style>

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Creative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-full blur-xl opacity-60"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-lg opacity-50"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute top-1/3 right-10 w-20 h-20 bg-gradient-to-r from-purple-500/15 to-blue-500/15 transform rotate-45 opacity-30"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl shadow-teal-500/25 animate-pulse">
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

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                Investment Analyst Agent
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience intelligent conversations powered by advanced AI. Choose between enhanced responses from our <span className="text-teal-400 font-semibold">Secondary Research Agent</span>,
              managing multiple data sources, or comprehensive stock analysis with our <span className="text-purple-400 font-semibold">Quant Agent</span>.
            </p>
          </div>          {/* Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Secondary Research Agent Card */}
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-teal-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col h-full relative overflow-hidden">
              {/* Card background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="text-center flex-1 flex flex-col relative z-10">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-teal-500/25 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {/* Subtle hover sparkles */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700" style={{transitionDelay: '0.1s'}}></div>
                </div>

                <h3 className="text-2xl font-bold text-teal-300 mb-4 group-hover:text-teal-200 transition-colors duration-300">
                  Secondary Research Agent
                </h3>

                <p className="text-gray-400 mb-8 leading-relaxed flex-1 group-hover:text-gray-300 transition-colors duration-300">
                  Advanced AI-powered secondary research agent for comprehensive analysis and insights with intelligent citations.
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => onStartChat("rag")}
                    className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 hover:scale-105 transform group-hover:translate-y-[-2px]"
                  >
                    Start Secondary Research Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Data Sources Card */}
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full relative overflow-hidden">
              {/* Card background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="text-center flex-1 flex flex-col relative z-10">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/25 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  {/* Subtle hover sparkles */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700" style={{transitionDelay: '0.1s'}}></div>
                </div>

                <h3 className="text-2xl font-bold text-blue-300 mb-4 group-hover:text-blue-200 transition-colors duration-300">
                  Data Sources
                </h3>

                <p className="text-gray-400 mb-8 leading-relaxed flex-1 group-hover:text-gray-300 transition-colors duration-300">
                  Manage and interact with multiple data sources including Jira, Confluence, SharePoint, and Google Drive through our intelligent multi-agent system.
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => onStartChat("dataSources")}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transform group-hover:translate-y-[-2px]"
                  >
                    Start Data Sources Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Quant Agent Card */}
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-full relative overflow-hidden">
              {/* Card background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="text-center flex-1 flex flex-col relative z-10">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  {/* Subtle hover sparkles */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700" style={{transitionDelay: '0.1s'}}></div>
                </div>

                <h3 className="text-2xl font-bold text-purple-300 mb-4 group-hover:text-purple-200 transition-colors duration-300">
                  Quant Agent
                </h3>

                <p className="text-gray-400 mb-8 leading-relaxed flex-1 group-hover:text-gray-300 transition-colors duration-300">
                  AI-powered stock analysis with fundamental analysis, technical indicators, and comprehensive investment insights.
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => onStartChat("quantAgent")}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform group-hover:translate-y-[-2px]"
                  >
                    Start Quant Agent
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 lg:mt-20">
            <p className="text-sm text-gray-500">
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
