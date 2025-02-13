"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PoemAnalysis as PoemAnalysisType } from "@/data/poems";

interface PoemAnalysisProps {
  analysis?: PoemAnalysisType;
}

export const PoemAnalysis: React.FC<PoemAnalysisProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      >
        <span className="font-medium">AI Analysis</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {questions.map(({ key, question }) => {
            const answer = analysis[key];
            if (!answer) return null;

            return (
              <div key={key} className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {question}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  {answer}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
