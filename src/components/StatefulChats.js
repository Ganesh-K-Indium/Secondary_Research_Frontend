import React from "react";
import ChatInterface from "./ChatInterface";

const RAG_URL = process.env.REACT_APP_RAG_URL || "http://localhost:8020/ask";
const INGESTION_URL = process.env.REACT_APP_INGESTION_SERVER_URL || "http://localhost:8006/chat";
const QUANT_AGENT_URL = process.env.REACT_APP_QUANT_AGENT_URL || "http://localhost:8567/chat";

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

export function DataSourcesChat({ messages, setMessages, sessionId, onSessionUpdate }) {
  return (
    <ChatInterface 
      serverUrl={INGESTION_URL} 
      mode="dataSources" 
      messages={messages} 
      setMessages={setMessages}
      sessionId={sessionId}
      onSessionUpdate={(id, msgs, mode) => onSessionUpdate(id, msgs, 'dataSources')}
    />
  );
}

export function QuantAgentChat({ messages, setMessages, sessionId, onSessionUpdate }) {
  return (
    <ChatInterface 
      serverUrl={QUANT_AGENT_URL} 
      mode="quantAgent" 
      messages={messages} 
      setMessages={setMessages}
      sessionId={sessionId}
      onSessionUpdate={(id, msgs, mode) => onSessionUpdate(id, msgs, 'quantAgent')}
    />
  );
}



