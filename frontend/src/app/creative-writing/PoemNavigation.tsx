"use client";

import React from "react";
import { Poem } from "@/data/poems";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PoemNavigationProps {
  poems: Poem[];
  currentIndex: number;
  onPoemChange: (index: number) => void;
  autoExpand: boolean;
  onAutoExpandChange: (value: boolean) => void;
  onShowAIAnalysis: () => void;
}

export const PoemNavigation: React.FC<PoemNavigationProps> = ({
  poems,
  currentIndex,
  onPoemChange,
  autoExpand,
  onAutoExpandChange,
  onShowAIAnalysis,
}) => {
  const currentPoem = poems[currentIndex];

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onPoemChange(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous poem"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center flex-1 px-4">
          <h2 className="text-xl font-serif mb-2">{currentPoem?.title}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Poem {currentIndex + 1} of {poems.length}
          </div>
        </div>

        <button
          onClick={() => onPoemChange(currentIndex + 1)}
          disabled={currentIndex === poems.length - 1}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next poem"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-between items-center px-4 mb-4">
        {currentPoem?.notes && (
          <div className="text-sm text-gray-600 dark:text-gray-400 italic flex-1">
            {currentPoem.notes}
          </div>
        )}

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={autoExpand}
              onChange={(e) => onAutoExpandChange(e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <span>Auto-expand poems</span>
          </label>

          {currentPoem?.analysis && (
            <button
              onClick={onShowAIAnalysis}
              className="text-sm px-4 py-2 bg-theme-light-primary dark:bg-theme-dark-primary 
                text-white rounded-full transition-colors hover:opacity-90"
            >
              See what AI thinks...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
