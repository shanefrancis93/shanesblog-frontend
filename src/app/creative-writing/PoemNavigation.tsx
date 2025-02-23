"use client";

import React from "react";
import { Poem } from "@/data/poems";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PoemNavigationProps {
  poems: Poem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  isChanging: boolean;
  id?: string;
}

export const PoemNavigation: React.FC<PoemNavigationProps> = ({
  poems,
  currentIndex,
  onNavigate,
  isChanging,
  id
}) => {
  const currentPoem = poems[currentIndex];

  return (
    <div id={id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous poem"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center flex-1 px-4 space-y-2">
          <h2 className={`text-xl font-serif transition-opacity duration-300 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
            {currentPoem?.title}
          </h2>
          
          {currentPoem?.description && (
            <p className={`text-sm text-gray-600 dark:text-gray-400 italic font-light transition-opacity duration-300 ${
              isChanging ? 'opacity-0' : 'opacity-100'
            }`}>
              {currentPoem.description}
            </p>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
            {currentIndex + 1} of {poems.length}
          </div>
        </div>

        <button
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={currentIndex === poems.length - 1}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next poem"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
