import React from 'react';

/**
 * Modern MarkdownRenderer component
 * Handles markdown formatting similar to ChatGPT/Claude UI
 * - Code blocks with syntax highlighting
 * - Bold, italic, underline text
 * - Lists (ordered and unordered)
 * - Links with proper styling
 * - Headers
 * - Removes unwanted symbols like ## at start of lines
 * - Terminal-like code block styling
 */
export default function MarkdownRenderer({ content }) {
  // Pre-process content to clean unwanted symbols
  const cleanContent = (text) => {
    return text
      .split('\n')
      .map(line => {
        // Remove leading ### or ## or # symbols that aren't part of proper header syntax
        const cleanedLine = line.replace(/^#{1,6}\s+/gm, '');
        return cleanedLine;
      })
      .join('\n');
  };

  // Parse content into blocks
  const parseContent = (text) => {
    const cleaned = cleanContent(text);
    const blocks = [];
    const lines = cleaned.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code block detection (triple backticks)
      if (line.trim().startsWith('```')) {
        const language = line.trim().slice(3).trim() || 'plaintext';
        let codeContent = [];
        i++;

        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeContent.push(lines[i]);
          i++;
        }

        blocks.push({
          type: 'code',
          language,
          content: codeContent.join('\n')
        });

        i++; // Skip closing ```
        continue;
      }

      // Heading detection
      if (line.match(/^#{1,6}\s+/)) {
        const match = line.match(/^(#{1,6})\s+(.*)/);
        if (match) {
          blocks.push({
            type: 'heading',
            level: match[1].length,
            content: match[2]
          });
          i++;
          continue;
        }
      }

      // Unordered list detection
      if (line.match(/^\s*[-•*]\s+/)) {
        const listItems = [];
        while (i < lines.length && lines[i].match(/^\s*[-•*]\s+/)) {
          const match = lines[i].match(/^\s*[-•*]\s+(.*)/);
          if (match) {
            listItems.push(match[1]);
          }
          i++;
        }
        blocks.push({
          type: 'unorderedList',
          items: listItems
        });
        continue;
      }

      // Ordered list detection
      if (line.match(/^\s*\d+\.\s+/)) {
        const listItems = [];
        while (i < lines.length && lines[i].match(/^\s*\d+\.\s+/)) {
          const match = lines[i].match(/^\s*\d+\.\s+(.*)/);
          if (match) {
            listItems.push(match[1]);
          }
          i++;
        }
        blocks.push({
          type: 'orderedList',
          items: listItems
        });
        continue;
      }

      // Table detection (markdown table format with pipes)
      if (line.includes('|') && i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        // Check if next line is a separator (contains dashes and pipes)
        if (nextLine.includes('|') && nextLine.match(/[\|-]/)) {
          const tableLines = [line];
          i++;
          tableLines.push(lines[i]); // Add separator line
          i++;

          // Collect table rows
          while (i < lines.length && lines[i].includes('|')) {
            tableLines.push(lines[i]);
            i++;
          }

          // Parse table
          const headerCells = tableLines[0].split('|').map(cell => cell.trim()).filter(cell => cell);
          const rows = tableLines.slice(2).map(row => 
            row.split('|').map(cell => cell.trim()).filter(cell => cell)
          );

          blocks.push({
            type: 'table',
            headers: headerCells,
            rows: rows
          });
          continue;
        }
      }

      // Paragraph with potential inline formatting
      if (line.trim()) {
        let paragraphLines = [line];
        i++;
        while (i < lines.length && lines[i].trim() && !lines[i].match(/^(#{1,6}\s+|```|[-•*]\s+|\d+\.\s+|.*\|.*)/)) {
          paragraphLines.push(lines[i]);
          i++;
        }
        blocks.push({
          type: 'paragraph',
          content: paragraphLines.join('\n')
        });
        continue;
      }

      // Empty line
      i++;
    }

    return blocks;
  };

  // Inline text formatter
  const renderInlineText = (text) => {
    const parts = [];

    // Pattern for inline code, bold, italic, links
    const patterns = [
      { regex: /`([^`]+)`/g, type: 'inlineCode' },
      { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },
      { regex: /__([^_]+)__/g, type: 'bold' },
      { regex: /\*([^*]+)\*/g, type: 'italic' },
      { regex: /_([^_]+)_/g, type: 'italic' },
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' }
    ];

    // Find all matches and sort by position
    const matches = [];
    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        matches.push({
          ...match,
          type: pattern.type,
          start: match.index,
          end: match.index + match[0].length,
          value: match[1],
          href: match[2]
        });
      }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches
    const filtered = [];
    for (const match of matches) {
      const overlaps = filtered.some(m => 
        (match.start >= m.start && match.start < m.end) ||
        (match.end > m.start && match.end <= m.end)
      );
      if (!overlaps) {
        filtered.push(match);
      }
    }

    // Build parts
    let index = 0;
    filtered.forEach((match, idx) => {
      // Add text before match
      if (match.start > index) {
        parts.push({
          type: 'text',
          content: text.slice(index, match.start)
        });
      }

      // Add formatted match
      parts.push({
        type: match.type,
        content: match.value,
        href: match.href
      });

      index = match.end;
    });

    // Add remaining text
    if (index < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(index)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  // Render inline elements
  const renderInline = (text) => {
    return renderInlineText(text).map((part, idx) => {
      switch (part.type) {
        case 'bold':
          return (
            <strong key={idx} className="font-semibold text-gray-900 dark:text-white transition-colors">
              {part.content}
            </strong>
          );
        case 'italic':
          return (
            <em key={idx} className="italic text-gray-700 dark:text-gray-100 transition-colors">
              {part.content}
            </em>
          );
        case 'inlineCode':
          return (
            <code
              key={idx}
              className="bg-gray-200 dark:bg-gray-700/50 px-2 py-1 rounded text-teal-600 dark:text-teal-300 text-sm font-mono transition-colors"
            >
              {part.content}
            </code>
          );
        case 'link':
          return (
            <a
              key={idx}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 underline transition-colors"
            >
              {part.content}
            </a>
          );
        case 'text':
        default:
          return <span key={idx}>{part.content}</span>;
      }
    });
  };

  // Main render
  const blocks = parseContent(content);

  return (
    <div className="space-y-3 leading-relaxed text-gray-800 dark:text-gray-100 transition-colors duration-500">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            const headingClasses = {
              1: 'text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2 transition-colors duration-500',
              2: 'text-xl font-bold text-gray-800 dark:text-gray-100 mt-3 mb-2 transition-colors duration-500',
              3: 'text-lg font-semibold text-gray-800 dark:text-gray-100 mt-2 mb-1 transition-colors duration-500',
              4: 'text-base font-semibold text-gray-800 dark:text-gray-100 mt-2 mb-1 transition-colors duration-500',
              5: 'text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1 mb-1 transition-colors duration-500',
              6: 'text-xs font-semibold text-gray-700 dark:text-gray-200 mt-1 mb-1 transition-colors duration-500'
            };
            const Tag = `h${block.level}`;
            return (
              <Tag key={idx} className={headingClasses[block.level]}>
                {renderInline(block.content)}
              </Tag>
            );

          case 'code':
            return (
              <div
                key={idx}
                className="border rounded-lg overflow-x-auto my-3 shadow-lg transition-colors duration-500 bg-gray-900 border-gray-800/50 dark:bg-gray-900 dark:border-gray-800/50"
              >
                {block.language !== 'plaintext' && (
                  <div className="px-4 py-2 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between transition-colors duration-500">
                    <span className="text-xs text-gray-400 font-mono uppercase tracking-wider transition-colors duration-500">
                      {block.language}
                    </span>
                  </div>
                )}
                <pre className="p-4 text-sm text-gray-100 font-mono overflow-x-auto transition-colors duration-500">
                  <code>{block.content}</code>
                </pre>
              </div>
            );

          case 'unorderedList':
            return (
              <ul key={idx} className="space-y-1 ml-4">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start space-x-3 text-gray-800 dark:text-gray-100 transition-colors duration-500"
                  >
                    <span className="text-teal-600 dark:text-teal-400 font-bold flex-shrink-0 mt-0.5 transition-colors duration-500">
                      •
                    </span>
                    <span className="flex-1">{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'orderedList':
            return (
              <ol key={idx} className="space-y-1 ml-4">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start space-x-3 text-gray-800 dark:text-gray-100 transition-colors duration-500"
                  >
                    <span className="text-teal-600 dark:text-teal-400 font-semibold flex-shrink-0 min-w-fit transition-colors duration-500">
                      {itemIdx + 1}.
                    </span>
                    <span className="flex-1">{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );

          case 'paragraph':
            return (
              <p key={idx} className="text-gray-800 dark:text-gray-100 leading-relaxed transition-colors duration-500">
                {renderInline(block.content)}
              </p>
            );

          case 'table':
            return (
              <div
                key={idx}
                className="overflow-x-auto my-3 rounded-lg border border-gray-300 dark:border-gray-700 shadow-md transition-colors duration-500"
              >
                <table className="w-full border-collapse bg-white dark:bg-gray-800 transition-colors duration-500">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 transition-colors duration-500">
                      {block.headers.map((header, hIdx) => (
                        <th
                          key={hIdx}
                          className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-gray-900 dark:text-white font-semibold transition-colors duration-500"
                        >
                          {renderInline(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={`${
                          rIdx % 2 === 0
                            ? 'bg-white dark:bg-gray-800'
                            : 'bg-gray-50 dark:bg-gray-700/30'
                        } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-500`}
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-800 dark:text-gray-100 transition-colors duration-500"
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
