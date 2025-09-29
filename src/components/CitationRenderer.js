import React from 'react';

/**
 * Component to render citations and documents in a structured format
 */
export const CitationRenderer = ({ citations, documents, performance }) => {
  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <div className="citations-container mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-3">📚 Sources & Citations ({citations.length})</h4>
      
      {citations.map((citation, idx) => (
        <div key={idx} className="citation-item mb-3 pb-3 border-b border-gray-200 last:border-b-0">
          <div className="citation-header">
            <span className="font-medium text-blue-700">
              {idx + 1}. {citation.file}
            </span>
            {citation.page && (
              <span className="ml-2 text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                Page {citation.page}
              </span>
            )}
          </div>
          
          {citation.content && (
            <div className="citation-content mt-2 text-sm text-gray-700 italic pl-4 border-l-2 border-blue-200">
              "{citation.content}"
            </div>
          )}
          
          {citation.image && (
            <div className="citation-image mt-2">
              <a 
                href={citation.image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                📷 View Image Reference
              </a>
            </div>
          )}
        </div>
      ))}
      
      {performance && performance.routing_decision && (
        <div className="performance-info mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Query processed via: <span className="font-medium">{performance.routing_decision}</span>
            {performance.documents_used > 0 && (
              <> • Documents analyzed: <span className="font-medium">{performance.documents_used}</span></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Component to render document analysis summary
 */
export const DocumentSummary = ({ documents, limit = 3 }) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  const displayDocuments = documents.slice(0, limit);
  const remainingCount = Math.max(0, documents.length - limit);

  return (
    <div className="document-summary mt-4 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-3">
        📄 Documents Analyzed ({documents.length})
      </h4>
      
      {displayDocuments.map((doc, idx) => (
        <div key={idx} className="document-item mb-3 pb-3 border-b border-blue-200 last:border-b-0">
          <div className="document-header font-medium text-blue-700">
            {idx + 1}. {doc.source}
            {doc.metadata?.page && (
              <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Page {doc.metadata.page}
              </span>
            )}
          </div>
          
          {doc.content && (
            <div className="document-preview mt-2 text-sm text-gray-700 pl-4">
              {doc.content.length > 150 ? 
                `${doc.content.substring(0, 150)}...` : 
                doc.content
              }
            </div>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className="text-sm text-blue-600 font-medium">
          ...and {remainingCount} more documents
        </div>
      )}
    </div>
  );
};

export default CitationRenderer;