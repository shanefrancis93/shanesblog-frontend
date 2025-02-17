'use client';

import { useState } from 'react';
import type { AIMetadata } from '../../app/api/blog/route';

interface AIBadgeProps {
  metadata: AIMetadata;
  className?: string;
}

export function AIBadge({ metadata, className = '' }: AIBadgeProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full
          bg-violet-100 dark:bg-violet-900/30
          text-violet-700 dark:text-violet-300
          hover:bg-violet-200 dark:hover:bg-violet-900/50
          transition-colors duration-200"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.241 2.013L16.5 14.5m-7.5 0h7.5m-7.5 0c-.276 0-.5.224-.5.5v5.5m8-5.5v5.5m-8-5.5v3.75m8-3.75v3.75m0 0a.5.5 0 01-.5.5H5.5a.5.5 0 01-.5-.5v-3.75m8 0a.5.5 0 00-.5-.5H5.5a.5.5 0 00-.5.5v3.75"
          />
        </svg>
        <span>AI Generated</span>
      </button>

      {showDetails && (
        <div className="absolute z-10 mt-2 p-4 rounded-lg shadow-xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          min-w-[250px]"
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Model</span>
              <span className="font-medium">{metadata.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Generated</span>
              <span className="font-medium">
                {new Date(metadata.generatedAt).toLocaleDateString()}
              </span>
            </div>
            {metadata.temperature !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Temperature</span>
                <span className="font-medium">{metadata.temperature}</span>
              </div>
            )}
            {metadata.promptTokens !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Prompt Tokens</span>
                <span className="font-medium">{metadata.promptTokens}</span>
              </div>
            )}
            {metadata.completionTokens !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Completion Tokens</span>
                <span className="font-medium">{metadata.completionTokens}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
