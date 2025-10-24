import React from "react";

function Lander({ onStartChat }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            Secondary Research Agent
          </h1>
          
          <p className="text-xl text-gray-300">
            Experience intelligent conversations powered by advanced AI. Choose between RAG-enhanced responses 
            or help train the system through ingestion chat.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* RAG Chat Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
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

            {/* Ingestion Chat Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-400 mb-3">Ingestion Chat</h2>
                <p className="text-gray-400 mb-4">
                  Help improve the system by providing new information and knowledge through natural conversation.
                </p>
              </div>
              <button
                onClick={() => onStartChat("ingestion")}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
              >
                Start Ingestion Chat
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
