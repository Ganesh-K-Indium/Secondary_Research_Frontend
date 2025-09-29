/**
 * Parse RAG response into structured data
 * {
 *   answer: string,
 *   related: [string],
 *   citations: [{ file, page, image, content }],
 *   documents: [{ content, source, metadata }],
 *   performance: { routing_decision, documents_used, metrics },
 *   session_info: object
 * }
 */
export function formatRagResponseForChat(data) {
  let answer = "";
  let related = [];
  let citations = [];
  let documents = [];
  let performance = {};
  let session_info = data.session_info || {};

  // --- Extract Answer ---
  if (typeof data.answer === 'string') {
    answer = data.answer.trim();
  } else if (data.answer && typeof data.answer === 'object') {
    if (data.answer.content) {
      answer = data.answer.content.trim();
    } else if (data.answer.messages && Array.isArray(data.answer.messages)) {
      const aiMessages = data.answer.messages.filter((msg) => msg.type === "ai");
      if (aiMessages.length > 0) {
        answer = aiMessages[aiMessages.length - 1].content?.trim() || "";
      }
    } else if (data.answer.Intermediate_message) {
      answer = data.answer.Intermediate_message.trim();
    }
  }

  // Clean up answer formatting
  if (answer) {
    answer = answer.replace(/^#{1,6}\s+/gm, '');
    answer = answer.replace(/^[-=]{3,}$/gm, '');
    answer = answer.replace(/^[^:\n]*:\s*-\s*\*\*[^:]*\*\*:\s*-\s*$/gm, '');
    answer = answer.replace(/^([^:\n*]+:\s*-)\s*$/gm, '**$1**');
    answer = answer.replace(/\n{3,}/g, '\n\n').trim();
  }

  // --- Extract Related Questions ---
  if (answer) {
    const relatedMatch = answer.match(/Related Questions?:?\s*((?:\d+\.\s*[^\n]+\n*)+)/i);
    if (relatedMatch) {
      related = relatedMatch[1]
        .split(/\n/)
        .map((q) => q.trim())
        .filter((q) => q.match(/^\d+\./));
      answer = answer.replace(/Related Questions?:?\s*(?:\d+\.\s*[^\n]+\n*)+/i, "").trim();
    }
  }

  // --- Extract Documents and Citations from New API Structure ---
  if (data.documents && Array.isArray(data.documents)) {
    documents = data.documents.map(doc => ({
      content: doc.content || "",
      source: doc.source || "Unknown",
      metadata: doc.metadata || {},
      type: doc.type || "Document"
    }));

    // Create citations from documents
    citations = data.documents
      .filter(doc => {
        // Filter out invalid documents
        if (!doc.content || doc.content.includes("This is an image with the caption:")) return false;
        if (doc.content.includes("10k_PDFs/meta/image")) return false;
        return doc.source && doc.source !== "Unknown";
      })
      .map(doc => {
        const citation = {
          file: doc.source,
          page: doc.metadata?.page_num || doc.metadata?.page || null,
          content: doc.content.length > 200 ? doc.content.substring(0, 200) + "..." : doc.content,
          image: null
        };

        // Add image if available and valid
        if (doc.metadata?.image_url && !doc.metadata.image_url.includes('10k_PDFs/meta/image')) {
          citation.image = doc.metadata.image_url;
        }

        return citation;
      });
  }

  // --- Handle Citation Info from New API ---
  if (data.citations && Array.isArray(data.citations)) {
    const apiCitations = data.citations.map(cit => ({
      file: cit.source || cit.file || "Unknown",
      page: cit.page_num || cit.page || null,
      content: cit.content || "",
      image: cit.image_url || null
    }));
    
    // Merge with existing citations, avoiding duplicates
    const existingSources = new Set(citations.map(c => `${c.file}_${c.page}`));
    apiCitations.forEach(cit => {
      const key = `${cit.file}_${cit.page}`;
      if (!existingSources.has(key)) {
        citations.push(cit);
      }
    });
  }

  // --- Performance Metrics ---
  performance = {
    routing_decision: data.routing_decision || 'unknown',
    documents_used: data.documents_used || 0,
    document_sources: data.document_sources || {},
    tool_calls: data.tool_calls || [],
    cross_reference_analysis: data.cross_reference_analysis || {},
    performance_metrics: data.performance_metrics || {}
  };

  return { 
    answer, 
    related, 
    citations, 
    documents, 
    performance, 
    session_info 
  };
}
