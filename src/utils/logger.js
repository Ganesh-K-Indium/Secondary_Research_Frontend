/**
 * Response Logger Utility
 * Formats and saves RAG/Ingestion responses as Markdown files
 */

/**
 * Format RAG graph output into Markdown with clear headings
 * @param {Object} data - The response data from RAG endpoint
 * @returns {string} - Formatted Markdown content
 */
export function formatGraphOutput(data) {
  const lines = [];
  const answerData = data.answer || {};

  if (answerData.messages) {
    lines.push("## Messages");
    answerData.messages.forEach((msg, index) => {
      if (typeof msg === 'object' && msg !== null) {
        const content = msg.content || '';
        const msgType = msg.type || 'unknown';
        lines.push(`### Message ${index + 1} (${msgType})`);
        lines.push(content);
      } else {
        lines.push(`- ${msg}`);
      }
      lines.push('');
    });
  }

  if (answerData.Intermediate_message) {
    lines.push("## Intermediate Message");
    lines.push(answerData.Intermediate_message);
    lines.push('');
  }

  if (answerData.documents) {
    lines.push("## Documents");
    answerData.documents.forEach((doc, index) => {
      lines.push(`### Document ${index + 1}`);
      if (typeof doc === 'object' && doc !== null) {
        if (doc.metadata) {
          lines.push(`**Metadata:** \`\`\`json\n${JSON.stringify(doc.metadata, null, 2)}\n\`\`\``);
        }
        if (doc.page_content) {
          lines.push(`**Content:** ${doc.page_content}`);
        }
        if (doc.type) {
          lines.push(`**Type:** ${doc.type}`);
        }
      } else {
        lines.push(String(doc));
      }
      lines.push('');
    });
  }

  if (answerData.retry_count !== undefined) {
    lines.push("## Retry Count");
    lines.push(String(answerData.retry_count));
    lines.push('');
  }

  if (answerData.tool_calls) {
    lines.push("## Tool Calls");
    answerData.tool_calls.forEach((call, index) => {
      if (typeof call === 'object' && call !== null) {
        lines.push(`- **Tool:** ${call.tool || 'Unknown'}`);
        if (call.input) {
          lines.push(`- **Input:** \`\`\`json\n${JSON.stringify(call.input, null, 2)}\n\`\`\``);
        }
        if (call.output) {
          lines.push(`- **Output:** \`\`\`json\n${JSON.stringify(call.output, null, 2)}\n\`\`\``);
        }
      } else {
        lines.push(String(call));
      }
      lines.push('');
    });
  }

  return lines.join('\n');
}

/**
 * Format ingestion response into Markdown with clear logs
 * @param {Object} data - The response data from ingestion endpoint
 * @returns {string} - Formatted Markdown content
 */
export function formatIngestionOutput(data) {
  const lines = [];
  const answerData = data.answer || {};

  if (answerData.request) {
    lines.push("## Request");
    lines.push(answerData.request);
    lines.push('');
  }

  if (answerData.logs) {
    lines.push("## Ingestion Logs");
    answerData.logs.forEach((log, index) => {
      lines.push(`${index + 1}. ${log}`);
    });
    lines.push('');
  }

  lines.push("## File Information");
  lines.push(`- **Source:** ${answerData.source || 'N/A'}`);
  lines.push(`- **File Name:** ${answerData.file_name || 'N/A'}`);
  lines.push(`- **Space Key:** ${answerData.space_key || 'N/A'}`);
  lines.push(`- **Ticket ID:** ${answerData.ticket_id || 'N/A'}`);
  lines.push(`- **File URL:** ${answerData.file_url || 'N/A'}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate timestamp string for filename
 * @returns {string} - Timestamp in YYYY-MM-DD_HH-MM-SS format
 */
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * Generate formatted timestamp for display
 * @returns {string} - Formatted timestamp for display
 */
function generateDisplayTimestamp() {
  const now = new Date();
  return now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Download content as a file
 * @param {string} content - File content
 * @param {string} filename - Name of the file to download
 * @param {string} mimeType - MIME type of the file
 */
function downloadFile(content, filename, mimeType = 'text/markdown') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Save formatted response as Markdown file
 * @param {Object} payload - The original query payload
 * @param {Object} data - The response data
 * @param {string} mode - The mode ('rag' or 'ingestion')
 */
export function logResponse(payload, data, mode = 'rag') {
  const timestamp = generateTimestamp();
  const displayTimestamp = generateDisplayTimestamp();
  const filename = `${mode}_response_${timestamp}.md`;
  
  // Decide which formatter to use
  let content;
  if (mode === 'ingestion' || (data.answer && data.answer.logs)) {
    content = formatIngestionOutput(data);
  } else {
    content = formatGraphOutput(data);
  }

  const mdContent = [
    '# API Response Report',
    `**Generated:** ${displayTimestamp}`,
    `**Mode:** ${mode.toUpperCase()}`,
    `**Query:** ${payload.query || 'N/A'}`,
    '',
    content
  ].join('\n');

  downloadFile(mdContent, filename);
}

/**
 * Save chat conversation as Markdown file
 * @param {Array} messages - Array of chat messages
 * @param {string} mode - The chat mode ('rag' or 'ingestion')
 */
export function exportChatHistory(messages, mode = 'rag') {
  const timestamp = generateTimestamp();
  const displayTimestamp = generateDisplayTimestamp();
  const filename = `${mode}_chat_history_${timestamp}.md`;
  
  const lines = [
    '# Chat History Export',
    `**Generated:** ${displayTimestamp}`,
    `**Mode:** ${mode.toUpperCase()}`,
    `**Total Messages:** ${messages.length}`,
    ''
  ];

  messages.forEach((msg, index) => {
    lines.push(`## Message ${index + 1} - ${msg.sender === 'user' ? 'User' : 'AI Assistant'}`);
    lines.push('');
    
    // Handle formatted text with sections
    if (msg.text.includes('**Related Questions:**') || msg.text.includes('**Citations:**')) {
      const blocks = msg.text.split('\n\n');
      blocks.forEach(block => {
        if (block.startsWith('**Related Questions:**')) {
          lines.push('### Related Questions');
          const questions = block.replace('**Related Questions:**', '').trim().split('\n');
          questions.forEach(q => {
            if (q.trim()) lines.push(`- ${q.trim()}`);
          });
        } else if (block.startsWith('**Citations:**')) {
          lines.push('### Citations');
          const citations = block.replace('**Citations:**', '').trim().split('\n');
          citations.forEach(c => {
            if (c.trim()) lines.push(`- ${c.trim()}`);
          });
        } else {
          lines.push(block);
        }
        lines.push('');
      });
    } else {
      lines.push(msg.text);
      lines.push('');
    }
    
    lines.push('---');
    lines.push('');
  });

  const mdContent = lines.join('\n');
  downloadFile(mdContent, filename);
}

const loggerUtils = {
  logResponse,
  exportChatHistory,
  formatGraphOutput,
  formatIngestionOutput
};

export default loggerUtils;