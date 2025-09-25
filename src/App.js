import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { RagChat, IngestionChat } from "./components/StatefulChats";
import Lander from "./Lander";

function App() {
  const [currentChat, setCurrentChat] = useState(null);

  const handleStartChat = (chatType) => {
    setCurrentChat(chatType);
  };

  if (!currentChat) {
    return <Lander onStartChat={handleStartChat} />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar currentChat={currentChat} setCurrentChat={setCurrentChat} />

      <div className="flex-1 relative overflow-hidden">
        {/* Both chats mounted; only one visible */}
        <div
          className={`absolute inset-0 transform transition-all duration-500 ease-in-out ${
            currentChat === "rag"
              ? "translate-x-0 opacity-100 z-10"
              : "-translate-x-full opacity-0 z-0 pointer-events-none"
          }`}
        >
          <RagChat />
        </div>

        <div
          className={`absolute inset-0 transform transition-all duration-500 ease-in-out ${
            currentChat === "ingestion"
              ? "translate-x-0 opacity-100 z-10"
              : "translate-x-full opacity-0 z-0 pointer-events-none"
          }`}
        >
          <IngestionChat />
        </div>
      </div>
    </div>
  );
}

export default App;
