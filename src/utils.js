/**
 * Parse RAG response into structured data
 * {
 *   answer: string,
 *   related: [string],
 *   citations: [{ file, page, image }]
 * }
 */
export function formatRagResponseForChat(data) {
  const answerData = data.answer || {};
  let answer = "";
  let related = [];
  let citations = [];

  // --- Final AI answer ---
  if (answerData.messages && Array.isArray(answerData.messages)) {
    const aiMessages = answerData.messages.filter((msg) => msg.type === "ai");
    if (aiMessages.length > 0) {
      answer = aiMessages[aiMessages.length - 1].content?.trim() || "";
    }
  }
  if (!answer && answerData.Intermediate_message) {
    answer = answerData.Intermediate_message.trim();
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
  if (answerData.documents && Array.isArray(answerData.documents)) {
    const validCitations = answerData.documents
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
