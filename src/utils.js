/**
 * Parse RAG response into structured data
 * {
 *   answer: string,
 *   related: [string],
 *   citations: [{ file, page, image }]
 * }
 */
export function formatRagResponseForChat(data) {
  let answer = "";
  let related = [];
  let citations = [];

  // --- Final AI answer ---
  // Handle both old format (nested in answer object) and new format (direct fields)
  if (data.answer && typeof data.answer === 'object' && data.answer.messages) {
    // Old format: answer is an object with messages
    const answerData = data.answer;
    if (answerData.messages && Array.isArray(answerData.messages)) {
      const aiMessages = answerData.messages.filter((msg) => msg.type === "ai");
      if (aiMessages.length > 0) {
        answer = aiMessages[aiMessages.length - 1].content?.trim() || "";
      }
    }
    if (!answer && answerData.Intermediate_message) {
      answer = answerData.Intermediate_message.trim();
    }
  } else if (data.answer && typeof data.answer === 'string') {
    // New format: answer is directly a string
    answer = data.answer.trim();
  } else if (data.intermediate_message) {
    // Fallback to intermediate_message
    answer = data.intermediate_message.trim();
  }

  // Clean up answer: remove markdown headers and unwanted formatting
  if (answer) {
    // Remove ### headers and similar markdown formatting
    answer = answer.replace(/^#{1,6}\s+/gm, '');
    // Remove any remaining markdown-style headers
    answer = answer.replace(/^[-=]{3,}$/gm, '');
    
    // Handle FoA and similar patterns intelligently
    // Only remove lines with broken formatting like "Family of Apps (FoA): - **Revenue**: -"
    answer = answer.replace(/^[^:\n]*:\s*-\s*\*\*[^:]*\*\*:\s*-\s*$/gm, '');
    
    // Bold headings that end with ": -" pattern (but don't already have **)
    answer = answer.replace(/^([^:\n*]+:\s*-)\s*$/gm, '**$1**');
    
    // Clean up extra whitespace
    answer = answer.replace(/\n{3,}/g, '\n\n').trim();
  }

  // --- Related Questions ---
  if (answer) {
    const relatedMatch = answer.match(/Related Questions?:?\s*((?:\d+\.\s*[^\n]+\n*)+)/i);
    if (relatedMatch) {
      related = relatedMatch[1]
        .split(/\n/)
        .map((q) => q.trim())
        .filter((q) => q.match(/^\d+\./));
      // Remove from main answer
      answer = answer.replace(/Related Questions?:?\s*(?:\d+\.\s*[^\n]+\n*)+/i, "").trim();
    }
  }

  // --- Citations ---
  // Handle both old format (nested in answer.documents) and new format (direct documents field)
  const documents = (data.answer && data.answer.documents) ? data.answer.documents : data.documents;

  if (documents && Array.isArray(documents)) {
    const validCitations = documents
      .filter((doc) => {
        // Ensure document has valid content and metadata
        if (!doc.page_content || typeof doc.page_content !== 'string') return false;
        if (!doc.metadata || typeof doc.metadata !== 'object') return false;

        const content = doc.page_content;
        const meta = doc.metadata;

        // Filter out image captions and invalid entries
        if (content.includes("This is an image with the caption:")) return false;
        if (content.includes("10k_PDFs/meta/image")) return false;
        
        // Ensure we have at least one valid source identifier
        return !!(meta.source_file || meta.file || meta.title || meta.url);
      })
      .map((doc) => {
        const meta = doc.metadata;
        const citation = {
          file: meta.source_file || meta.file || meta.title || '',
          page: meta.page_num || null,
          image: null
        };

        // Only include image URL if it's a valid image source
        if (meta.image_url && !meta.image_url.includes('10k_PDFs/meta/image')) {
          citation.image = meta.image_url;
        }

        return citation;
      });

    // Only assign citations if we have valid ones
    if (validCitations.length > 0) {
      citations = validCitations;
    }
  }

  return { answer, related, citations };
}
