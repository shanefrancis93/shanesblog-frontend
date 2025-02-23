"use client";

import React from "react";
import { Poem } from "@/data/poems";

interface BottomPoemNavigationProps {
  poems: Poem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  isChanging: boolean;
}

export const BottomPoemNavigation: React.FC<BottomPoemNavigationProps> = ({
  poems,
  currentIndex,
  onNavigate,
  isChanging,
}) => {
  return (
    <div className="w-full py-4 pb-8 mt-auto border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center space-x-16 mb-6">
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="group relative"
          aria-label="Previous poem"
        >
          <div className="
            w-16 h-0.5 bg-gray-300 dark:bg-gray-600 
            transform -translate-x-2 transition-all duration-300 ease-in-out
            group-hover:bg-gray-400 dark:group-hover:bg-gray-500
            group-disabled:opacity-50 group-disabled:cursor-not-allowed
          "/>
          <div className="
            absolute left-0 top-1/2 -translate-y-1/2
            w-3 h-3 border-l-2 border-b-2 
            border-gray-300 dark:border-gray-600
            transform -rotate-45 
            group-hover:border-gray-400 dark:group-hover:border-gray-500
            transition-all duration-300 ease-in-out
            group-disabled:opacity-50
          "/>
          {!isChanging && currentIndex > 0 && (
            <span className="
              absolute top-full mt-2 left-1/2 transform -translate-x-1/2
              text-sm text-gray-600 dark:text-gray-400
              whitespace-nowrap font-light
            ">
              {poems[currentIndex - 1].title}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={currentIndex === poems.length - 1}
          className="group relative"
          aria-label="Next poem"
        >
          <div className="
            w-16 h-0.5 bg-gray-300 dark:bg-gray-600 
            transform translate-x-2 transition-all duration-300 ease-in-out
            group-hover:bg-gray-400 dark:group-hover:bg-gray-500
            group-disabled:opacity-50 group-disabled:cursor-not-allowed
          "/>
          <div className="
            absolute right-0 top-1/2 -translate-y-1/2
            w-3 h-3 border-r-2 border-t-2 
            border-gray-300 dark:border-gray-600
            transform rotate-45
            group-hover:border-gray-400 dark:group-hover:border-gray-500
            transition-all duration-300 ease-in-out
            group-disabled:opacity-50
          "/>
          {!isChanging && currentIndex < poems.length - 1 && (
            <span className="
              absolute top-full mt-2 left-1/2 transform -translate-x-1/2
              text-sm text-gray-600 dark:text-gray-400
              whitespace-nowrap font-light
            ">
              {poems[currentIndex + 1].title}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
