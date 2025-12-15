import React, { useState, useEffect } from 'react';

/**
 * Modern TypedLoader component with typing animation
 * Displays rotating loading messages with animated dots
 * Mimics the feel of modern AI chat interfaces
 */
export default function TypedLoader({ message, variant = 'default' }) {
  const [displayText, setDisplayText] = useState('');
  const [dotCount, setDotCount] = useState(0);

  // Typing animation effect
  useEffect(() => {
    if (!message) return;

    let index = 0;
    let interval = setInterval(() => {
      if (index < message.length) {
        setDisplayText(message.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30); // Adjust speed of typing

    return () => clearInterval(interval);
  }, [message]);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getDots = () => {
    return '.'.repeat(dotCount);
  };

  if (variant === 'skeleton') {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded-full w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-700/50 rounded-full w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-700/50 rounded-full w-4/5 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <div className="text-base text-gray-100">
          {displayText}
          <span className="text-teal-400 font-semibold animate-pulse">
            {getDots()}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-teal-400"
            style={{
              animation: 'opacity-fade 1.5s ease-in-out infinite',
              animationDelay: `${i * 500}ms`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
