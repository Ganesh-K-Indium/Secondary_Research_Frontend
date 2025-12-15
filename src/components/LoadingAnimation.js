import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function LoadingAnimation() {
  const { isDark } = useTheme();

  return (
    <div className={`flex items-center space-x-3 p-4 rounded-lg transition-colors duration-500 ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
      {/* Minimal animated dots */}
      <div className="flex space-x-1">
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`} style={{animationDelay: '0s'}}></div>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`} style={{animationDelay: '0.15s'}}></div>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`} style={{animationDelay: '0.3s'}}></div>
      </div>
      <span className={`text-sm transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        AI is thinking
      </span>
    </div>
  );
}
