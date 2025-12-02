import React from "react";

function Lander({ onStartChat }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            Secondary Research Agent
          </h1>
          
          <p className="text-xl text-gray-300">
            Experience intelligent conversations powered by advanced AI. Choose between RAG-enhanced responses, 
            manage data sources, or analyze stocks with our Quant Agent.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* RAG Chat Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-700/50 hover:border-teal-500/30">
              <div>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-teal-400 mb-3">RAG Chat</h2>
                <p className="text-gray-400 mb-4">
                  Chat with an AI that has access to your knowledge base for more accurate and contextual responses.
                </p>
              </div>
              <button
                onClick={() => onStartChat("rag")}
                className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors duration-200"
              >
                Start RAG Chat
              </button>
            </div>

            {/* Data Sources Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-700/50 hover:border-blue-500/30">
              <div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-blue-400 mb-3">Data Sources</h2>
                <p className="text-gray-400 mb-4">
                  Manage and interact with multiple data sources including Jira, Confluence, SharePoint, and Google Drive.
                </p>
              </div>
              <button
                onClick={() => onStartChat("dataSources")}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
              >
                Start Data Sources Chat
              </button>
            </div>

            {/* Quant Agent Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-700/50 hover:border-purple-500/30">
              <div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-purple-400 mb-3">Quant Agent</h2>
                <p className="text-gray-400 mb-4">
                  AI-powered stock analysis with fundamental analysis, technical indicators, and investment insights.
                </p>
              </div>
              <button
                onClick={() => onStartChat("quantAgent")}
                className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors duration-200"
              >
                Start Quant Agent
              </button>
            </div>
          </div>

          <div className="mt-16 text-gray-400">
            <p className="text-sm">
              Built with advanced AI technology and secure data handling
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lander;
