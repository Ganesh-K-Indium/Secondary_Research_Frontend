import React, { useState } from 'react';

/**
 * ImageCard Component
 * Displays embedded images from chat responses with proper styling
 * Supports various image sources (Cloudinary, direct URLs, etc.)
 */
export default function ImageCard({ src, alt = "Chart Image", caption = null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `chart-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="my-3 p-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <p className="text-red-700 dark:text-red-300 text-sm">Failed to load image: {alt}</p>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-md bg-white dark:bg-gray-800">
      {/* Image container */}
      <div className="relative bg-gray-100 dark:bg-gray-700/50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700/50">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Loading image...</p>
            </div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="w-full h-auto max-h-96 object-contain"
        />
      </div>

      {/* Caption and action bar */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {caption && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">📊</span> {caption}
          </p>
        )}
        <div className="flex items-center justify-between">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center space-x-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>View Full Size</span>
          </a>
          <button
            onClick={downloadImage}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center space-x-1 transition-colors"
            title="Download image"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
