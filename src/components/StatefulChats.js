import React, { useState } from "react";
import ChatInterface from "./ChatInterface";

const RAG_URL = process.env.REACT_APP_RAG_URL || "http://localhost:8001/ask";
const INGESTION_URL = process.env.REACT_APP_INGESTION_SERVER_URL || "http://localhost:8000/ingest";

export function RagChat() {
  const [messages, setMessages] = useState([]); // persists as long as RagChat is mounted
  return <ChatInterface serverUrl={RAG_URL} mode="rag" messages={messages} setMessages={setMessages} />;
}

export function IngestionChat() {
  const [messages, setMessages] = useState([]); // persists as long as IngestionChat is mounted
  return <ChatInterface serverUrl={INGESTION_URL} mode="ingestion" messages={messages} setMessages={setMessages} />;
}
