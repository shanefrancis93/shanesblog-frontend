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
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
        <span>AI Generated</span>
      </button>

      {showDetails && (
        <div className="absolute z-10 mt-2 p-4 rounded-lg shadow-lg
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          min-w-[300px]"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Generated with {metadata.models.join(', ')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metadata.generatedAt ? new Date(metadata.generatedAt).toLocaleString() : 'Date not available'}
              </p>
            </div>

            {metadata.contributions && metadata.contributions.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Model Contributions
                </h5>
                <div className="space-y-2">
                  {metadata.contributions.map((contribution, index) => (
                    <div 
                      key={index}
                      className="text-sm"
                    >
                      <div className="font-medium text-gray-700 dark:text-gray-300">
                        {contribution.section || 'General Contribution'}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {contribution.model} - {contribution.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
