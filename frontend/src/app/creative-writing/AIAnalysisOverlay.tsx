"use client";

import React from "react";
import { X } from "lucide-react";
import { PoemAnalysis as PoemAnalysisType } from "@/data/poems";

interface AIAnalysisOverlayProps {
  analysis?: PoemAnalysisType;
  onClose: () => void;
}

export const AIAnalysisOverlay: React.FC<AIAnalysisOverlayProps> = ({
  analysis,
  onClose,
}) => {
  if (!analysis) return null;

  const questions = [
    {
      key: "favoriteLines" as const,
      question: "What lines stand out as particularly meaningful?",
    },
    {
      key: "interpretation" as const,
      question: "How do you interpret this poem?",
    },
    {
      key: "literaryDevices" as const,
      question: "What literary devices are employed?",
    },
    {
      key: "challengingAspects" as const,
      question: "What aspects of the poem are most challenging?",
    },
    {
      key: "emotionalImpact" as const,
      question: "What emotional response does this poem evoke?",
    },
  ];

  return (
    <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm p-6 overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-serif">AI Analysis</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Close analysis"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {questions.map(({ key, question }) => {
          const answer = analysis[key];
          if (!answer) return null;

          return (
            <div key={key} className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {question}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                {answer}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
