import React, { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

/**
 * TypedResponse Component
 * Displays bot response with character-by-character typing animation
 * Seamlessly renders markdown content as it types
 */
export default function TypedResponse({ content, isComplete = true }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(!isComplete);

  useEffect(() => {
    if (!content) return;

    if (isComplete) {
      // If response is already complete, show it immediately without typing
      setDisplayText(content);
      setIsTyping(false);
      return;
    }

    // Character-by-character typing animation
    let index = 0;
    let interval = setInterval(() => {
      if (index < content.length) {
        setDisplayText(content.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15); // Adjust speed (lower = faster, higher = slower)

    return () => clearInterval(interval);
  }, [content, isComplete]);

  return (
    <div className="relative">
      <div className="text-base text-gray-100 dark:text-gray-100">
        <MarkdownRenderer content={displayText} />
      </div>
      {isTyping && (
        <div className="absolute bottom-0 right-0 w-1 h-6 bg-teal-400 animate-pulse ml-1"></div>
      )}
    </div>
  );
}
