import React from "react";
import ChatInterface from "./ChatInterface";

const RAG_URL = process.env.REACT_APP_RAG_URL || "http://localhost:8001/ask";
const INGESTION_URL = process.env.REACT_APP_INGESTION_SERVER_URL || "http://localhost:8005/chat";

export function RagChat({ messages, setMessages, sessionId, onSessionUpdate }) {
  return (
    <ChatInterface 
      serverUrl={RAG_URL} 
      mode="rag" 
      messages={messages} 
      setMessages={setMessages}
      sessionId={sessionId}
      onSessionUpdate={(id, msgs, mode) => onSessionUpdate(id, msgs, 'rag')}
    />
  );
}

export function IngestionChat({ messages, setMessages, sessionId, onSessionUpdate }) {
  return (
    <ChatInterface 
      serverUrl={INGESTION_URL} 
      mode="ingestion" 
      messages={messages} 
      setMessages={setMessages}
      sessionId={sessionId}
      onSessionUpdate={(id, msgs, mode) => onSessionUpdate(id, msgs, 'ingestion')}
    />
  );
}
