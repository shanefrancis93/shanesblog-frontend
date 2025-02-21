"use client";

import React from "react";
import Image from "next/image";
import { Poem, LLMType } from "@/data/poems";

interface PoemAIGalleryProps {
  poem: Poem;
  isChanging?: boolean;
}

const llmInfo: Record<LLMType, { name: string; color: string }> = {
  claude: {
    name: "Claude",
    color: "bg-purple-100 dark:bg-purple-900",
  },
  gpt: {
    name: "GPT-4",
    color: "bg-green-100 dark:bg-green-900",
  },
  gemini: {
    name: "Gemini",
    color: "bg-blue-100 dark:bg-blue-900",
  },
};

export const PoemAIGallery: React.FC<PoemAIGalleryProps> = ({
  poem,
  isChanging = false,
}) => {
  if (!poem.llm_analysis) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <span className="text-gray-400">No AI analysis available</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {Object.entries(poem.llm_analysis).map(([llmType, analysis]) => {
        const { name, color } = llmInfo[llmType as LLMType];
        if (!analysis.analysis.image_prompt) return null;

        return (
          <div
            key={llmType}
            className="relative flex flex-col h-full rounded-lg overflow-hidden"
          >
            <div className={`${color} px-3 py-1 text-sm font-medium text-center`}>
              {name}
            </div>
            <div className="relative flex-1 min-h-[200px]">
              <Image
                src={`/images/poems/${poem.slug}-${llmType}.webp`}
                alt={`${name}'s interpretation of ${poem.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`
                  object-contain transition-opacity duration-300
                  ${isChanging ? "opacity-0" : "opacity-100"}
                `}
              />
            </div>
            <div className="p-2 text-xs text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              {analysis.analysis.image_prompt}
            </div>
          </div>
        );
      })}
    </div>
  );
};
